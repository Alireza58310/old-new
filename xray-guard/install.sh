#!/usr/bin/env bash
#
# install.sh — نصب‌کننده‌ی یک‌دستوری Xray Guard.
#
# استفاده (نصب یا آپدیت، فرقی نداره):
#   curl -fsSL https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/main/xray-guard/install.sh | sudo bash
#
# مسیر نصب پیش‌فرض /opt/xray-guard هست؛ برای تغییرش:
#   curl -fsSL .../install.sh | sudo INSTALL_DIR=/opt/my-dir bash
#
# این اسکریپت idempotent هست: هر بار اجراش کنی سورس رو از ریپو آپدیت می‌کنه،
# وابستگی‌ها رو sync می‌کنه، و اگه سرویس روشن بوده ری‌استارتش می‌کنه —
# config.yaml و دیتابیس موجود هیچ‌وقت پاک یا بازنویسی نمی‌شن.
#
# موقع اولین نصب چند سؤال می‌پرسه (دامنه/پورت/SSH/پنل) و خودش تو
# config.yaml می‌نویسه. تو محیط غیرتعاملی (بدون /dev/tty) به‌جاش از
# متغیرهای محیطی زیر می‌خونه (همه اختیاری):
#   DASHBOARD_DOMAIN, DASHBOARD_PORT,
#   SERVER_NAME, SERVER_HOST, SERVER_SSH_PORT, SERVER_SSH_USER,
#   SERVER_SSH_AUTH (key|password), SERVER_SSH_KEY_PATH, SERVER_SSH_PASSWORD,
#   SERVER_IFACE, SERVER_LOG_PATH,
#   PANEL_BASE_URL, PANEL_BASE_PATH, PANEL_USERNAME, PANEL_PASSWORD
#
# نیازمندی‌ها: Ubuntu یا Debian با systemd و دسترسی root.

set -euo pipefail

REPO_URL="https://github.com/Alireza58310/old-new.git"
REPO_SUBDIR="xray-guard"
REPO_BRANCH="main"
INSTALL_DIR="${INSTALL_DIR:-/opt/xray-guard}"
CLONE_DIR="/opt/.xray-guard-src"
SERVICE_NAME="xray-guard"

log()  { printf '[..] %s\n' "$*"; }
ok()   { printf '[OK] %s\n' "$*"; }
warn() { printf '[WARN] %s\n' "$*" >&2; }
die()  { printf '[FAIL] %s\n' "$*" >&2; exit 1; }

[[ "${EUID:-$(id -u)}" == "0" ]] || die "با روت اجرا کن (مثلاً: sudo bash install.sh یا pipe با sudo)"
command -v apt-get >/dev/null 2>&1 || die "فعلاً فقط روی Ubuntu/Debian (apt) پشتیبانی می‌شه"
command -v systemctl >/dev/null 2>&1 || die "systemd لازمه و پیدا نشد"

log "نصب پیش‌نیازها (git, python3, venv, rsync)..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq git python3 python3-venv python3-pip rsync >/dev/null
ok "پیش‌نیازها آماده‌ست"

log "گرفتن/به‌روزرسانی سورس از ریپو..."
if [[ -d "$CLONE_DIR/.git" ]]; then
    git -C "$CLONE_DIR" fetch --depth 1 origin "$REPO_BRANCH" -q
    git -C "$CLONE_DIR" reset --hard "origin/$REPO_BRANCH" -q
else
    rm -rf "$CLONE_DIR"
    git clone --depth 1 --branch "$REPO_BRANCH" "$REPO_URL" "$CLONE_DIR" -q
fi
[[ -d "$CLONE_DIR/$REPO_SUBDIR" ]] || die "پوشه‌ی «$REPO_SUBDIR» تو ریپو پیدا نشد"
ok "سورس به‌روزه"

FIRST_INSTALL=0
if [[ ! -d "$INSTALL_DIR" || -z "$(ls -A "$INSTALL_DIR" 2>/dev/null)" ]]; then
    FIRST_INSTALL=1
fi
mkdir -p "$INSTALL_DIR"

log "همگام‌سازی فایل‌ها با $INSTALL_DIR ..."
rsync -a --delete \
    --exclude 'config.yaml' \
    --exclude '*.db' \
    --exclude 'venv/' \
    --exclude '__pycache__/' \
    "$CLONE_DIR/$REPO_SUBDIR/" "$INSTALL_DIR/"
ok "فایل‌ها به‌روز شدن (config.yaml و دیتابیس موجود دست‌نخورده موندن)"

log "ساخت/به‌روزرسانی محیط پایتون..."
cd "$INSTALL_DIR"
python3 -m venv venv
./venv/bin/pip install -q --upgrade pip
./venv/bin/pip install -q -r requirements.txt
ok "وابستگی‌های پایتون آماده‌ست"

CERTS_DIR="$INSTALL_DIR/certs"

# فقط تو اولین نصب (یعنی وقتی هنوز config.yaml نداریم) این سؤالات پرسیده
# می‌شن؛ آپدیت‌های بعدی ازشون رد می‌شن و config.yaml دست‌نخورده می‌مونه.
if [[ ! -f "$INSTALL_DIR/config.yaml" ]]; then
    cp "$INSTALL_DIR/config.example.yaml" "$INSTALL_DIR/config.yaml"
    echo
    log "چند سؤال برای تکمیل خودکار config.yaml (همه‌شون بعداً هم با nano قابل تغییرن):"
    echo

    INTERACTIVE=0
    [[ -r /dev/tty ]] && INTERACTIVE=1

    if [[ "$INTERACTIVE" == "1" ]]; then
        read -r -p "دامنه‌ی داشبورد (Enter = رد شو، فقط HTTP ساده): " DOMAIN < /dev/tty || true
        read -r -p "پورت داشبورد [پیش‌فرض 8088]: " PORT < /dev/tty || true

        read -r -p "اسم این سرور Xray برای نمایش تو پنل [پیش‌فرض server-1]: " SRV_NAME < /dev/tty || true
        read -r -p "آی‌پی یا هاست سرور (برای SSH، Enter = بعداً دستی اضافه کن): " SRV_HOST < /dev/tty || true
        if [[ -n "${SRV_HOST:-}" ]]; then
            read -r -p "پورت SSH [پیش‌فرض 22]: " SRV_SSH_PORT < /dev/tty || true
            read -r -p "یوزر SSH [پیش‌فرض root]: " SRV_SSH_USER < /dev/tty || true
            read -r -p "احراز هویت SSH با کلید یا پسورد؟ [key/password, پیش‌فرض key]: " SRV_AUTH < /dev/tty || true
            if [[ "${SRV_AUTH:-key}" == "password" ]]; then
                read -r -s -p "پسورد SSH: " SRV_SSH_PASS < /dev/tty || true; echo
            else
                read -r -p "مسیر کلید SSH [پیش‌فرض /root/.ssh/id_rsa]: " SRV_SSH_KEY < /dev/tty || true
            fi
            read -r -p "اینترفیس شبکه‌ی سرور [پیش‌فرض eth0 — با ip -br a چک کن]: " SRV_IFACE < /dev/tty || true
            read -r -p "مسیر access.log ایکس‌ری روی سرور [پیش‌فرض /var/log/xray/access.log]: " SRV_LOG < /dev/tty || true
            read -r -p "آدرس پنل 3x-ui (مثل https://1.2.3.4:2053): " SRV_PANEL_URL < /dev/tty || true
            read -r -p "webBasePath پنل [پیش‌فرض /]: " SRV_PANEL_BASEPATH < /dev/tty || true
            read -r -p "یوزرنیم پنل: " SRV_PANEL_USER < /dev/tty || true
            read -r -s -p "پسورد پنل: " SRV_PANEL_PASS < /dev/tty || true; echo
        fi
    else
        DOMAIN="${DASHBOARD_DOMAIN:-}"
        PORT="${DASHBOARD_PORT:-8088}"
        SRV_NAME="${SERVER_NAME:-}"
        SRV_HOST="${SERVER_HOST:-}"
        SRV_SSH_PORT="${SERVER_SSH_PORT:-}"
        SRV_SSH_USER="${SERVER_SSH_USER:-}"
        SRV_AUTH="${SERVER_SSH_AUTH:-key}"
        SRV_SSH_KEY="${SERVER_SSH_KEY_PATH:-}"
        SRV_SSH_PASS="${SERVER_SSH_PASSWORD:-}"
        SRV_IFACE="${SERVER_IFACE:-}"
        SRV_LOG="${SERVER_LOG_PATH:-}"
        SRV_PANEL_URL="${PANEL_BASE_URL:-}"
        SRV_PANEL_BASEPATH="${PANEL_BASE_PATH:-}"
        SRV_PANEL_USER="${PANEL_USERNAME:-}"
        SRV_PANEL_PASS="${PANEL_PASSWORD:-}"
        warn "ترمینال تعاملی پیدا نشد؛ تنظیمات از متغیرهای محیطی (یا پیش‌فرض) خونده شد."
    fi

    DOMAIN="$(echo "${DOMAIN:-}" | xargs || true)"
    PORT="${PORT:-8088}"
    SRV_NAME="${SRV_NAME:-server-1}"
    SRV_SSH_PORT="${SRV_SSH_PORT:-22}"
    SRV_SSH_USER="${SRV_SSH_USER:-root}"
    SRV_AUTH="${SRV_AUTH:-key}"
    SRV_SSH_KEY="${SRV_SSH_KEY:-/root/.ssh/id_rsa}"
    SRV_IFACE="${SRV_IFACE:-eth0}"
    SRV_LOG="${SRV_LOG:-/var/log/xray/access.log}"
    SRV_PANEL_BASEPATH="${SRV_PANEL_BASEPATH:-/}"

    TLS_CERT=""
    TLS_KEY=""
    if [[ -n "$DOMAIN" ]]; then
        log "ساخت گواهی SSL (self-signed) برای $DOMAIN..."
        mkdir -p "$CERTS_DIR"
        if mapfile -t CERT_OUT < <(bash "$INSTALL_DIR/scripts/gen-fake-ssl.sh" "$DOMAIN" "$CERTS_DIR"); then
            TLS_CERT="${CERT_OUT[0]:-}"
            TLS_KEY="${CERT_OUT[1]:-}"
            ok "گواهی ساخته شد: $TLS_CERT"
            warn "این گواهی self-signed هست؛ مرورگر اولین بار هشدار می‌ده (طبیعیه)."
        else
            warn "ساخت گواهی شکست خورد؛ داشبورد بدون SSL (فقط HTTP) بالا میاد."
            DOMAIN=""
        fi
    fi

    export XG_PORT="$PORT" XG_DOMAIN="$DOMAIN" XG_TLS_CERT="$TLS_CERT" XG_TLS_KEY="$TLS_KEY" \
           XG_SRV_NAME="$SRV_NAME" XG_SRV_HOST="${SRV_HOST:-}" XG_SRV_SSH_PORT="$SRV_SSH_PORT" \
           XG_SRV_SSH_USER="$SRV_SSH_USER" XG_SRV_AUTH="$SRV_AUTH" XG_SRV_SSH_KEY="$SRV_SSH_KEY" \
           XG_SRV_SSH_PASS="${SRV_SSH_PASS:-}" XG_SRV_IFACE="$SRV_IFACE" XG_SRV_LOG="$SRV_LOG" \
           XG_SRV_PANEL_URL="${SRV_PANEL_URL:-}" XG_SRV_PANEL_BASEPATH="$SRV_PANEL_BASEPATH" \
           XG_SRV_PANEL_USER="${SRV_PANEL_USER:-}" XG_SRV_PANEL_PASS="${SRV_PANEL_PASS:-}"

    ./venv/bin/python <<'PYEOF'
import os
import yaml


def env(key, default=""):
    return os.environ.get(key, default)


with open("config.yaml") as f:
    cfg = yaml.safe_load(f)

web = cfg.setdefault("web", {})
port = env("XG_PORT", "8088")
web["port"] = int(port) if port else 8088
web["domain"] = env("XG_DOMAIN") or None
web["tls_cert"] = env("XG_TLS_CERT") or None
web["tls_key"] = env("XG_TLS_KEY") or None

host = env("XG_SRV_HOST")
if host:
    ssh_cfg = {
        "host": host,
        "port": int(env("XG_SRV_SSH_PORT", "22") or 22),
        "user": env("XG_SRV_SSH_USER", "root"),
    }
    if env("XG_SRV_AUTH", "key") == "password":
        ssh_cfg["password"] = env("XG_SRV_SSH_PASS")
    else:
        ssh_cfg["key_path"] = env("XG_SRV_SSH_KEY", "/root/.ssh/id_rsa")

    cfg["servers"] = [{
        "name": env("XG_SRV_NAME", "server-1"),
        "interface": env("XG_SRV_IFACE", "eth0"),
        "access_log_path": env("XG_SRV_LOG", "/var/log/xray/access.log"),
        "ssh": ssh_cfg,
        "panel": {
            "base_url": env("XG_SRV_PANEL_URL"),
            "web_base_path": env("XG_SRV_PANEL_BASEPATH", "/"),
            "username": env("XG_SRV_PANEL_USER"),
            "password": env("XG_SRV_PANEL_PASS"),
            "verify_ssl": False,
        },
    }]
else:
    cfg["servers"] = []

with open("config.yaml", "w") as f:
    yaml.safe_dump(cfg, f, allow_unicode=True, sort_keys=False)
PYEOF
    unset XG_SRV_SSH_PASS XG_SRV_PANEL_PASS

    ok "config.yaml با جواب‌هات پر شد"
    if [[ -z "${SRV_HOST:-}" ]]; then
        warn "هیچ سروری وارد نشد؛ لیست servers خالیه — هروقت خواستی با nano اضافه کن."
    fi
fi

CURRENT_PORT="$(./venv/bin/python -c 'import yaml; print(yaml.safe_load(open("config.yaml")).get("web",{}).get("port",8088))' 2>/dev/null || echo 8088)"
if command -v ufw >/dev/null 2>&1; then
    ufw allow "${CURRENT_PORT}/tcp" >/dev/null 2>&1 || true
    ok "پورت ${CURRENT_PORT}/tcp تو ufw باز شد"
else
    warn "ufw پیدا نشد؛ اگه فایروال دیگه‌ای فعاله، خودت پورت ${CURRENT_PORT} رو باز کن"
fi

log "تنظیم سرویس systemd..."
cat > "/etc/systemd/system/${SERVICE_NAME}.service" <<UNIT
[Unit]
Description=Xray Guard
After=network.target

[Service]
WorkingDirectory=${INSTALL_DIR}
ExecStart=${INSTALL_DIR}/venv/bin/python ${INSTALL_DIR}/app.py
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable "${SERVICE_NAME}" -q
ok "سرویس ${SERVICE_NAME} ثبت شد — این سرویس زیر systemd مستقل از نشست SSH اجرا می‌شه؛"
log "یعنی وصله‌ی SSH که بسته بشه (یا حتی قطع بشه) داشبورد و بررسی‌ها همچنان روشن می‌مونن،"
log "تا وقتی خودت با دستور xray-guard یا systemctl خاموشش کنی."

log "نصب دستور مدیریتی xray-guard..."
sed \
    -e "s#__INSTALL_DIR__#${INSTALL_DIR}#g" \
    -e "s#__SERVICE_NAME__#${SERVICE_NAME}#g" \
    -e "s#__REPO_URL__#https://github.com/Alireza58310/old-new/tree/${REPO_BRANCH}/${REPO_SUBDIR}#g" \
    -e "s#__REPO_RAW_INSTALL__#https://raw.githubusercontent.com/Alireza58310/old-new/refs/heads/${REPO_BRANCH}/${REPO_SUBDIR}/install.sh#g" \
    "$INSTALL_DIR/scripts/xray-guard-cli.sh" > /usr/local/bin/xray-guard
chmod +x /usr/local/bin/xray-guard
ok "از این به بعد با تایپ 'xray-guard' منوی مدیریت باز می‌شه (مثل x-ui)"

echo
if [[ "$FIRST_INSTALL" == "1" ]]; then
    ok "نصب تموم شد."
    if [[ -z "$(./venv/bin/python -c 'import yaml; print(yaml.safe_load(open("config.yaml")).get("servers") or "")' 2>/dev/null)" ]]; then
        warn "سروری تو config.yaml ثبت نشده؛ قبل از استارت پرش کن:  nano $INSTALL_DIR/config.yaml"
    fi
    log "روشن کردن:  xray-guard   (یا:  systemctl start ${SERVICE_NAME})"
else
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        systemctl restart "$SERVICE_NAME"
        ok "آپدیت شد و سرویس ری‌استارت شد."
    else
        ok "آپدیت شد. سرویس قبلاً خاموش بوده، همون‌طور می‌مونه."
        log "روشن کردن:  xray-guard   (یا:  systemctl start ${SERVICE_NAME})"
    fi
fi
log "مدیریت از این به بعد:  xray-guard"
log "لاگ زنده:              journalctl -u ${SERVICE_NAME} -f"
