"""
نصب/بررسی/حذف اسکریپت‌های محافظتی xray-decoy-prevention (standard/strict)
روی سرورهای هدف، از طریق SSH. خود اسکریپت‌ها idempotent و خوداتکا هستن؛
این ماژول فقط آپلودشون می‌کنه، اجراشون می‌کنه و نتیجه رو ثبت می‌کنه.
"""
from __future__ import annotations

from pathlib import Path

from ssh_client import ssh_pool

SCRIPTS_DIR = Path(__file__).parent / "scripts"
EDITIONS = ("standard", "strict")
INSTALLED_PATH = "/usr/local/sbin/xray-decoy-prevention.sh"


def _script_path(edition: str) -> Path:
    if edition not in EDITIONS:
        raise ValueError(f"edition نامعتبر: {edition}")
    p = SCRIPTS_DIR / f"xray-decoy-prevention-{edition}.sh"
    if not p.exists():
        raise FileNotFoundError(f"اسکریپت پیدا نشد: {p}")
    return p


def deploy(server_name: str, ssh_cfg: dict, edition: str, storage) -> tuple[bool, str]:
    local_script = _script_path(edition)
    remote_tmp = f"/root/.xray-decoy-prevention-{edition}.sh"
    ssh_pool.upload_file(server_name, ssh_cfg, str(local_script), remote_tmp)
    ssh_pool.run(server_name, ssh_cfg, f"chmod +x {remote_tmp}")
    # نصب می‌تونه چند ده ثانیه طول بکشه (نصب پکیج dnsdist و ...)
    code, out, err = ssh_pool.run_status(server_name, ssh_cfg, remote_tmp, timeout=240)
    ok = code == 0
    combined = (out + err).strip()
    storage.upsert_decoy_status(server_name, edition, installed=ok, ok=ok,
                                 output=combined[-4000:], action="deploy")
    return ok, combined


def check(server_name: str, ssh_cfg: dict, storage) -> tuple[bool, str]:
    code, out, err = ssh_pool.run_status(
        server_name, ssh_cfg, f"{INSTALLED_PATH} --check", timeout=60
    )
    combined = (out + err).strip()
    prev = storage.get_decoy_status(server_name)
    edition = prev["edition"] if prev else "unknown"

    if code == 127:
        # 127 یعنی shell خود فایل رو پیدا نکرد؛ یعنی هنوز نصب نشده،
        # نه این‌که نصب شده ولی خراب باشه.
        message = combined or "اسکریپت محافظت رو این سرور نصب نشده."
        storage.upsert_decoy_status(server_name, edition, installed=False, ok=False,
                                     output=message[-4000:], action="check")
        return False, message

    ok = code == 0
    storage.upsert_decoy_status(server_name, edition, installed=True, ok=ok,
                                 output=combined[-4000:], action="check")
    return ok, combined


def uninstall(server_name: str, ssh_cfg: dict, storage) -> tuple[bool, str]:
    code, out, err = ssh_pool.run_status(
        server_name, ssh_cfg, f"{INSTALLED_PATH} --uninstall", timeout=120
    )
    ok = code == 0
    combined = (out + err).strip()
    storage.upsert_decoy_status(server_name, "none", installed=False, ok=ok,
                                 output=combined[-4000:], action="uninstall")
    return ok, combined
