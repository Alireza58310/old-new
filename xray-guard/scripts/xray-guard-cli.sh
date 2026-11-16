#!/usr/bin/env bash
#
# این فایل یه قالبه (template) — install.sh مقادیر __...__ رو با sed جایگزین
# می‌کنه و نتیجه رو به /usr/local/bin/xray-guard کپی می‌کنه. دستی اجراش
# نکن؛ نسخه‌ی نصب‌شده‌ش با دستور xray-guard در دسترسه.

set -uo pipefail

INSTALL_DIR="__INSTALL_DIR__"
SERVICE_NAME="__SERVICE_NAME__"
REPO_URL="__REPO_URL__"
REPO_RAW_INSTALL="__REPO_RAW_INSTALL__"

need_root() {
    [[ "${EUID:-$(id -u)}" == "0" ]] || { echo "این گزینه نیاز به روت داره: sudo xray-guard"; exit 1; }
}

pause() { echo; read -n 1 -s -r -p "برای برگشت به منو یه کلید بزن..."; echo; }

status_block() {
    if systemctl is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
        echo "وضعیت سرویس      : روشن"
    else
        echo "وضعیت سرویس      : خاموش"
    fi
    if systemctl is-enabled --quiet "$SERVICE_NAME" 2>/dev/null; then
        echo "استارت خودکار     : فعال"
    else
        echo "استارت خودکار     : غیرفعال"
    fi
    local port
    port="$("$INSTALL_DIR/venv/bin/python" -c \
        'import yaml; print(yaml.safe_load(open("'"$INSTALL_DIR"'/config.yaml")).get("web",{}).get("port",8088))' \
        2>/dev/null || echo "؟")"
    echo "پورت داشبورد      : $port"
}

about() {
    clear
    cat <<EOF
==================================================
                   Xray Guard
==================================================
سورس این پروژه:
  ${REPO_URL}

منبع تهدید (Threat Source):
  سورس پروژه مخرب: https://github.com/PdYrust/Xray-backdraft/
  این دفاع (تشخیص نسبت ترافیک rx/گزارش پنل + نرخ اتصال) مخصوص جلوگیری از
  نسخه‌ی v26.11.9 این کد مخرب نوشته شده است.
  اگه اون پروژه‌ی مخرب آپدیت بشه، این اسکریپت هم باید آپدیت بشه تا تداخل
  پیش نیاد — با گزینه‌ی «آپدیت از سورس» تو همین منو.

مسیر نصب: ${INSTALL_DIR}
==================================================
EOF
    pause
}

do_update() {
    need_root
    echo "در حال آپدیت از سورس..."
    if curl -fsSL "$REPO_RAW_INSTALL" | INSTALL_DIR="$INSTALL_DIR" bash; then
        echo "آپدیت تموم شد."
    else
        echo "آپدیت شکست خورد؛ اتصال اینترنت یا ریپو رو چک کن."
    fi
    pause
}

do_uninstall() {
    need_root
    read -r -p "مطمئنی می‌خوای Xray Guard رو کامل حذف کنی؟ [y/N]: " yn
    if [[ "$yn" != "y" && "$yn" != "Y" ]]; then
        echo "لغو شد."; pause; return
    fi
    systemctl stop "$SERVICE_NAME" 2>/dev/null || true
    systemctl disable "$SERVICE_NAME" 2>/dev/null || true
    rm -f "/etc/systemd/system/${SERVICE_NAME}.service"
    systemctl daemon-reload
    read -r -p "config.yaml و دیتابیس هم کامل پاک بشن؟ [y/N]: " yn2
    if [[ "$yn2" == "y" || "$yn2" == "Y" ]]; then
        rm -rf "$INSTALL_DIR"
        echo "همه‌چیز حذف شد."
    else
        echo "سرویس حذف شد؛ فایل‌ها تو $INSTALL_DIR نگه داشته شدن."
    fi
    rm -f /usr/local/bin/xray-guard
    echo "خداحافظ."
    exit 0
}

show_menu() {
    clear
    echo "=================================================="
    echo "                   Xray Guard                      "
    echo "=================================================="
    status_block
    echo "--------------------------------------------------"
    echo " 1) روشن کردن (start)"
    echo " 2) خاموش کردن (stop)"
    echo " 3) ری‌استارت (restart)"
    echo " 4) وضعیت کامل (status)"
    echo " 5) فعال کردن استارت خودکار (enable)"
    echo " 6) غیرفعال کردن استارت خودکار (disable)"
    echo " 7) مشاهده‌ی لاگ زنده"
    echo " 8) آپدیت از سورس"
    echo " 9) درباره / سورس / منبع تهدید"
    echo "10) حذف کامل (uninstall)"
    echo " 0) خروج"
    echo "=================================================="
    echo -n "انتخاب: "
}

while true; do
    show_menu
    read -r choice
    case "$choice" in
        1) need_root && systemctl start "$SERVICE_NAME" && echo "روشن شد."; pause ;;
        2) need_root && systemctl stop "$SERVICE_NAME" && echo "خاموش شد."; pause ;;
        3) need_root && systemctl restart "$SERVICE_NAME" && echo "ری‌استارت شد."; pause ;;
        4) systemctl status "$SERVICE_NAME" --no-pager; pause ;;
        5) need_root && systemctl enable "$SERVICE_NAME" -q && echo "فعال شد."; pause ;;
        6) need_root && systemctl disable "$SERVICE_NAME" -q && echo "غیرفعال شد."; pause ;;
        7) journalctl -u "$SERVICE_NAME" -f ;;
        8) do_update ;;
        9) about ;;
        10) do_uninstall ;;
        0) exit 0 ;;
        *) echo "گزینه نامعتبره."; sleep 1 ;;
    esac
done
