from __future__ import annotations

import sys
import yaml
from pathlib import Path

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import iface_monitor
import log_parser
import actions
import decoy_prevention
from detector import evaluate
from storage import Storage
from threexui_client import ThreeXUIClient

CONFIG_PATH = Path(__file__).parent / "config.yaml"
if not CONFIG_PATH.exists():
    print("config.yaml پیدا نشد. از config.example.yaml کپی بگیر و پرش کن.")
    sys.exit(1)

with open(CONFIG_PATH, encoding="utf-8") as f:
    CONFIG = yaml.safe_load(f)

THRESHOLDS = CONFIG["thresholds"]
NOTIFY = CONFIG.get("notify", {})
storage = Storage(CONFIG["storage"]["sqlite_path"])

# لیست سرورها ممکنه خالی باشه (مثلاً اولین نصب بدون پر کردن سرور) یا کلید
# servers اصلاً تو config.yaml دستی‌نویس نباشه؛ هر دو حالت نباید کرش کنه.
SERVERS: list[dict] = CONFIG.get("servers") or []

_seen_names: set[str] = set()
for _s in SERVERS:
    if _s["name"] in _seen_names:
        print(f"خطا: اسم سرور «{_s['name']}» تو config.yaml بیش از یه‌بار تکرار شده؛ "
              f"اسم هر سرور باید یکتا باشه.")
        sys.exit(1)
    _seen_names.add(_s["name"])

# کلاینت پنل برای هر سرور
panels: dict[str, ThreeXUIClient] = {}
for s in SERVERS:
    p = s["panel"]
    panels[s["name"]] = ThreeXUIClient(
        base_url=p["base_url"],
        web_base_path=p.get("web_base_path", "/"),
        username=p["username"],
        password=p["password"],
        verify_ssl=p.get("verify_ssl", False),
    )

# آخرین مقدار rx هر سرور، برای محاسبه‌ی دلتا
_last_rx: dict[str, int] = {}

SERVERS_BY_NAME = {s["name"]: s for s in SERVERS}


def _server_cfg(name: str) -> dict:
    cfg = SERVERS_BY_NAME.get(name)
    if cfg is None:
        raise HTTPException(404, f"سروری با نام «{name}» تو config.yaml پیدا نشد")
    return cfg


def poll_server(server_cfg: dict):
    name = server_cfg["name"]
    ssh_cfg = server_cfg["ssh"]
    interface = server_cfg["interface"]
    window = THRESHOLDS["history_window_seconds"]

    try:
        rx_now = iface_monitor.get_rx_bytes(name, ssh_cfg, interface)
    except Exception as exc:
        print(f"[{name}] خطا در خوندن rx: {exc}")
        return
    if rx_now is None:
        print(f"[{name}] اینترفیس {interface} پیدا نشد.")
        return

    rx_prev = _last_rx.get(name)
    _last_rx[name] = rx_now
    if rx_prev is None:
        return  # اولین پول، هنوز دلتا نداریم
    rx_delta = max(rx_now - rx_prev, 0)

    panel = panels[name]
    reported_delta = 0
    try:
        before = {t["email"]: t for t in _safe_list_traffics(panel)}
    except Exception as exc:
        print(f"[{name}] خطا در خوندن ترافیک پنل: {exc}")
        before = {}
    reported_delta = sum(max(t.get("down", 0), 0) for t in before.values())
    # توجه: این مقدار تجمعیه نه دلتا؛ برای سادگی در این نسخه‌ی MVP به‌عنوان
    # سیگنال کمکیه، منبع اصلی تشخیص نسبت rx/لاگ کانکشنه. برای دقت بیشتر
    # می‌شه مقدار قبلی رو هم مثل rx ذخیره و دلتای واقعی گرفت (TODO در README).

    log_text = log_parser.tail_log(name, ssh_cfg, server_cfg["access_log_path"])
    analysis = log_parser.analyze(log_text, window_seconds=window)

    storage.add_metric(name, rx_delta, reported_delta)

    alerts = evaluate(
        server_name=name,
        rx_delta_bytes=rx_delta,
        reported_delta_bytes=reported_delta,
        email_connection_counts=analysis["email_connection_counts"],
        window_seconds=window,
        thresholds=THRESHOLDS,
    )

    for alert in alerts:
        storage.add_alert(alert.server, alert.severity, alert.kind, alert.message, alert.suspects)
        actions.notify_telegram(
            NOTIFY.get("telegram_bot_token", ""),
            NOTIFY.get("telegram_chat_id", ""),
            f"⚠️ [{alert.server}] {alert.message}",
        )
        if alert.kind == "server_ratio" and THRESHOLDS.get("auto_global_ratelimit"):
            mbit = THRESHOLDS["global_ratelimit_mbit"]
            actions.apply_global_ratelimit(name, ssh_cfg, interface, mbit)
            storage.set_ratelimit(name, True, mbit)
        if alert.kind == "client_churn" and THRESHOLDS.get("auto_lock_suspect"):
            for email in alert.suspects:
                actions.lock_client(panel, name, email, storage, reason=alert.message)


def _safe_list_traffics(panel: ThreeXUIClient) -> list[dict]:
    """ترافیک هر کلاینت آنلاین رو برمی‌گردونه؛ خطای تکی رو نادیده می‌گیره."""
    results = []
    try:
        for email in panel.list_online_emails():
            traffic = panel.get_client_traffic(email)
            if traffic:
                results.append(traffic)
    except Exception:
        pass
    return results


scheduler = BackgroundScheduler()
for server_cfg in SERVERS:
    scheduler.add_job(
        poll_server, "interval",
        seconds=THRESHOLDS["poll_interval_seconds"],
        args=[server_cfg],
        id=server_cfg["name"],
        max_instances=1,
    )

app = FastAPI(title="Xray Guard")


@app.on_event("startup")
def _start_scheduler():
    scheduler.start()


@app.on_event("shutdown")
def _stop_scheduler():
    scheduler.shutdown(wait=False)


@app.get("/api/servers")
def api_servers():
    return [{"name": s["name"], "interface": s["interface"]} for s in SERVERS]


@app.get("/api/metrics")
def api_metrics(server: str, limit: int = 200):
    return storage.recent_metrics(server, limit)


@app.get("/api/alerts")
def api_alerts(limit: int = 100):
    return storage.recent_alerts(limit)


@app.get("/api/locks")
def api_locks():
    return storage.active_locks()


@app.get("/api/ratelimit/status")
def api_ratelimit_status():
    return storage.list_ratelimit()


class RatelimitClearRequest(BaseModel):
    server: str


@app.post("/api/ratelimit/clear")
def api_ratelimit_clear(req: RatelimitClearRequest):
    server_cfg = _server_cfg(req.server)
    actions.remove_global_ratelimit(req.server, server_cfg["ssh"], server_cfg["interface"])
    storage.set_ratelimit(req.server, False, 0)
    return {"ok": True}


class UnlockRequest(BaseModel):
    server: str
    email: str


@app.post("/api/unlock")
def api_unlock(req: UnlockRequest):
    panel = panels.get(req.server)
    if panel is None:
        raise HTTPException(404, "سرور پیدا نشد")
    ok = actions.unlock_client(panel, req.server, req.email, storage)
    if not ok:
        raise HTTPException(500, "باز کردن قفل شکست خورد")
    return {"ok": True}


class DecoyDeployRequest(BaseModel):
    server: str
    edition: str


class DecoyServerRequest(BaseModel):
    server: str


@app.get("/api/decoy/status")
def api_decoy_status():
    return storage.list_decoy_status()


@app.post("/api/decoy/deploy")
def api_decoy_deploy(req: DecoyDeployRequest):
    server_cfg = _server_cfg(req.server)
    if req.edition not in decoy_prevention.EDITIONS:
        raise HTTPException(400, "edition باید standard یا strict باشه")
    try:
        ok, output = decoy_prevention.deploy(req.server, server_cfg["ssh"], req.edition, storage)
    except FileNotFoundError as exc:
        raise HTTPException(500, str(exc))
    if not ok:
        raise HTTPException(500, f"نصب شکست خورد:\n{output[-1500:]}")
    return {"ok": True, "output": output[-3000:]}


@app.post("/api/decoy/check")
def api_decoy_check(req: DecoyServerRequest):
    server_cfg = _server_cfg(req.server)
    ok, output = decoy_prevention.check(req.server, server_cfg["ssh"], storage)
    if not ok:
        raise HTTPException(500, f"بررسی شکست خورد یا محافظت نصب نیست:\n{output[-1500:]}")
    return {"ok": True, "output": output[-3000:]}


@app.post("/api/decoy/uninstall")
def api_decoy_uninstall(req: DecoyServerRequest):
    server_cfg = _server_cfg(req.server)
    ok, output = decoy_prevention.uninstall(req.server, server_cfg["ssh"], storage)
    if not ok:
        raise HTTPException(500, f"حذف محافظت شکست خورد:\n{output[-1500:]}")
    return {"ok": True, "output": output[-3000:]}


app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")


@app.get("/")
def dashboard():
    return FileResponse(Path(__file__).parent / "static" / "dashboard.html")


if __name__ == "__main__":
    import uvicorn
    web = CONFIG.get("web", {})
    run_kwargs = {"host": web.get("host", "0.0.0.0"), "port": web.get("port", 8088)}
    tls_cert, tls_key = web.get("tls_cert"), web.get("tls_key")
    if tls_cert and tls_key:
        run_kwargs["ssl_certfile"] = tls_cert
        run_kwargs["ssl_keyfile"] = tls_key
        scheme, host_label = "https", web.get("domain") or run_kwargs["host"]
    else:
        scheme, host_label = "http", run_kwargs["host"]
    print(f"Xray Guard dashboard: {scheme}://{host_label}:{run_kwargs['port']}")
    uvicorn.run(app, **run_kwargs)
