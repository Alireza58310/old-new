"""
منطق تشخیص. دو سیگنال مستقل از هم رو ترکیب می‌کنه:

1) سطح سرور: رشد واقعی rx کارت شبکه در مقابل مجموع ترافیکی که پنل گزارش می‌ده.
   فاصله‌ی زیاد = یه جایی سرور داره دیتا دانلود می‌کنه که تو حساب‌وکتاب پنل نیست.

2) سطح کاربر: نرخ اتصال هر ایمیل در لاگ Xray. ترافیک واقعی پنهان بمونه هم،
   رفتار پشتش (تعداد زیاد اتصال کوتاه‌عمر در بازه‌ی کوتاه) تو لاگ قابل دیدنه.

وقتی هر دو هم‌زمان رخ بدن، سطح اطمینان بالاست و می‌شه مظنون رو مشخص کرد.
"""
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Alert:
    server: str
    severity: str  # "warning" | "critical"
    kind: str      # "server_ratio" | "client_churn" | "client_locked"
    message: str
    suspects: list[str] = field(default_factory=list)


def evaluate(
    server_name: str,
    rx_delta_bytes: int,
    reported_delta_bytes: int,
    email_connection_counts: dict[str, int],
    window_seconds: int,
    thresholds: dict,
) -> list[Alert]:
    alerts: list[Alert] = []

    min_bytes = thresholds["global_min_rx_delta_mb"] * 1024 * 1024
    ratio_limit = thresholds["global_ratio_multiplier"]
    server_anomaly = False

    if rx_delta_bytes >= min_bytes:
        # +1 بایت برای جلوگیری از تقسیم بر صفر وقتی پنل صفر گزارش کرده
        ratio = rx_delta_bytes / max(reported_delta_bytes, 1)
        if ratio >= ratio_limit:
            server_anomaly = True
            alerts.append(Alert(
                server=server_name,
                severity="critical",
                kind="server_ratio",
                message=(
                    f"در {window_seconds} ثانیه، {rx_delta_bytes / 1024 / 1024:.1f}MB از کارت شبکه "
                    f"رد شده ولی پنل فقط {reported_delta_bytes / 1024 / 1024:.1f}MB گزارش داده "
                    f"(نسبت {ratio:.1f}x). احتمال سوءمصرف نوع تقویت ترافیک."
                ),
            ))

    churn_limit = thresholds["conn_churn_per_minute"] * (window_seconds / 60.0)
    suspects = [email for email, count in email_connection_counts.items() if count >= churn_limit]
    if suspects:
        alerts.append(Alert(
            server=server_name,
            severity="critical" if server_anomaly else "warning",
            kind="client_churn",
            message=(
                f"کاربر(های) {', '.join(suspects)} در {window_seconds} ثانیه "
                f"تعداد اتصال غیرعادی بالایی داشتن."
                + (" هم‌زمان با ناهماهنگی ترافیک سرور." if server_anomaly else "")
            ),
            suspects=suspects,
        ))

    return alerts
