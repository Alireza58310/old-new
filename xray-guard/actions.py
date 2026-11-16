from __future__ import annotations

import requests

from ssh_client import ssh_pool
from threexui_client import ThreeXUIClient, ThreeXUIError


def lock_client(panel: ThreeXUIClient, server_name: str, email: str, storage, reason: str) -> bool:
    found = panel.find_client(email)
    if not found:
        print(f"[{server_name}] کلاینت {email} تو پنل پیدا نشد؛ قفل نشد.")
        return False
    inbound_id, client = found
    if not client.get("enable", True):
        return True  # از قبل غیرفعاله
    try:
        panel.set_client_enabled(inbound_id, client, enabled=False)
        storage.add_lock(server_name, email, reason)
        print(f"[{server_name}] کلاینت {email} قفل شد. دلیل: {reason}")
        return True
    except (requests.RequestException, ThreeXUIError) as exc:
        print(f"[{server_name}] قفل کردن {email} شکست خورد: {exc}")
        return False


def unlock_client(panel: ThreeXUIClient, server_name: str, email: str, storage) -> bool:
    found = panel.find_client(email)
    if not found:
        return False
    inbound_id, client = found
    try:
        panel.set_client_enabled(inbound_id, client, enabled=True)
        storage.deactivate_lock(server_name, email)
        return True
    except (requests.RequestException, ThreeXUIError) as exc:
        print(f"[{server_name}] باز کردن قفل {email} شکست خورد: {exc}")
        return False


_RATE_LIMITED_INTERFACES: set[tuple[str, str]] = set()


def apply_global_ratelimit(server_name: str, ssh_cfg: dict, interface: str, mbit: int):
    key = (server_name, interface)
    if key in _RATE_LIMITED_INTERFACES:
        return  # از قبل فعاله، دوباره لازم نیست
    # htb ساده: کل ترافیک ورودی رو به یه سقف محدود می‌کنه (نیازمند ifb برای ingress واقعی)
    cmds = [
        f"modprobe ifb numifbs=1 2>/dev/null",
        f"ip link set dev ifb0 up 2>/dev/null",
        f"tc qdisc add dev {interface} handle ffff: ingress 2>/dev/null",
        f"tc filter add dev {interface} parent ffff: protocol ip u32 match u32 0 0 "
        f"action mirred egress redirect dev ifb0 2>/dev/null",
        f"tc qdisc add dev ifb0 root tbf rate {mbit}mbit burst 32kbit latency 400ms 2>/dev/null",
    ]
    for cmd in cmds:
        ssh_pool.run(server_name, ssh_cfg, cmd)
    _RATE_LIMITED_INTERFACES.add(key)
    print(f"[{server_name}] محدودیت اضطراری {mbit}mbit روی {interface} اعمال شد.")


def remove_global_ratelimit(server_name: str, ssh_cfg: dict, interface: str):
    key = (server_name, interface)
    ssh_pool.run(server_name, ssh_cfg, f"tc qdisc del dev {interface} handle ffff: ingress 2>/dev/null")
    ssh_pool.run(server_name, ssh_cfg, "tc qdisc del dev ifb0 root 2>/dev/null")
    _RATE_LIMITED_INTERFACES.discard(key)


def notify_telegram(token: str, chat_id: str, text: str):
    if not token or not chat_id:
        return
    try:
        requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            data={"chat_id": chat_id, "text": text},
            timeout=8,
        )
    except requests.RequestException as exc:
        print(f"ارسال پیام تلگرام شکست خورد: {exc}")
