"""
خوندن بایت‌های rx واقعی اینترفیس شبکه روی سرور، مستقیم از /proc/net/dev.
این عدد مستقل از هر پنل یا ابزاریه؛ واقعاً چی از کارت شبکه رد شده.
"""
from __future__ import annotations

from ssh_client import ssh_pool


def get_rx_bytes(server_name: str, ssh_cfg: dict, interface: str) -> int | None:
    out = ssh_pool.run(server_name, ssh_cfg, "cat /proc/net/dev")
    for line in out.splitlines():
        if ":" not in line:
            continue
        name, rest = line.split(":", 1)
        if name.strip() != interface:
            continue
        fields = rest.split()
        # ستون اول بعد از نام اینترفیس = rx bytes
        try:
            return int(fields[0])
        except (IndexError, ValueError):
            return None
    return None
