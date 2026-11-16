"""
تحلیل لاگ access.log خود Xray (نه هیچ ابزار شخص‌ثالثی).
با loglevel=info، هر اتصال یه خط شبیه این می‌زنه:
  2026/11/15 10:00:00 from 1.2.3.4:51514 accepted tcp:example.com:443 [in -> out] email: user1@local
از این خط فقط IP، ایمیل و زمان رو برمی‌داریم تا نرخ اتصالِ هر کاربر رو بسنجیم.
نرخ غیرعادی بالا (ده‌ها اتصال کوتاه‌عمر در دقیقه) امضای رفتاری این نوع سوءمصرفه،
مستقل از این‌که از چه ابزاری استفاده شده.
"""
from __future__ import annotations

import re
from collections import Counter
from datetime import datetime, timedelta

from ssh_client import ssh_pool

LOG_LINE_RE = re.compile(
    r"^(?P<ts>\d{4}/\d{2}/\d{2} \d{2}:\d{2}:\d{2}).*?"
    r"from\s+(?P<ip>[\d.]+):\d+\s+accepted.*?email:\s*(?P<email>\S+)"
)


def tail_log(server_name: str, ssh_cfg: dict, log_path: str, lines: int = 4000) -> str:
    # اگه فایل بزرگه tail سبک‌تر از cat کل فایله
    cmd = f"tail -n {lines} {log_path} 2>/dev/null"
    return ssh_pool.run(server_name, ssh_cfg, cmd)


def analyze(log_text: str, window_seconds: int) -> dict:
    """
    خروجی:
      {
        "email_connection_counts": {email: count_in_window},
        "email_ips": {email: {ip, ip, ...}},
      }
    فقط خطوطی که داخل window_seconds اخیر هستن حساب می‌شن (بر اساس آخرین timestamp دیده‌شده در لاگ).
    """
    parsed = []
    for line in log_text.splitlines():
        m = LOG_LINE_RE.search(line)
        if not m:
            continue
        try:
            ts = datetime.strptime(m.group("ts"), "%Y/%m/%d %H:%M:%S")
        except ValueError:
            continue
        parsed.append((ts, m.group("ip"), m.group("email")))

    if not parsed:
        return {"email_connection_counts": {}, "email_ips": {}}

    latest_ts = max(p[0] for p in parsed)
    cutoff = latest_ts - timedelta(seconds=window_seconds)

    counts: Counter[str] = Counter()
    email_ips: dict[str, set[str]] = {}
    for ts, ip, email in parsed:
        if ts < cutoff:
            continue
        counts[email] += 1
        email_ips.setdefault(email, set()).add(ip)

    return {
        "email_connection_counts": dict(counts),
        "email_ips": {k: sorted(v) for k, v in email_ips.items()},
    }
