#!/usr/bin/env bash
#
# gen-fake-ssl.sh <domain> <output_dir>
#
# یه گواهی SSL خودامضا (self-signed) برای <domain> می‌سازه، امضاشده با یه
# Root CA مشترک که بین اجراهای مختلف همین اسکریپت (زیر <output_dir>/_rootCA)
# دوباره استفاده می‌شه. برای HTTPS روی داشبورد Xray Guard وقتی دامنه‌ی
# واقعی با DNS معتبر نداری.
#
# خروجی (دو خط رو stdout): مسیر fullchain.pem و بعدش مسیر privkey.pem.
# خطاها می‌رن تو stderr، پس خروجی استاندارد همیشه فقط همون دو مسیره.
#
# نکته: این گواهی رو هیچ مرورگری به‌صورت پیش‌فرض معتبر نمی‌دونه (چون امضاش
# با یه CA عمومیِ شناخته‌شده نیست)، پس اولین بار که به داشبورد وصل می‌شی
# هشدار گواهی می‌بینی — طبیعیه. اگه می‌خوای این هشدار نیاد، می‌تونی
# <output_dir>/_rootCA/rootCA.crt رو تو مرورگر/سیستم‌عامل خودت به‌عنوان یه
# CA معتبر import کنی.

set -euo pipefail

DOMAIN="${1:?usage: gen-fake-ssl.sh <domain> <output_dir>}"
OUT_BASE="${2:?usage: gen-fake-ssl.sh <domain> <output_dir>}"
DOMAIN="$(echo "$DOMAIN" | tr 'A-Z' 'a-z' | xargs)"

if ! echo "$DOMAIN" | grep -Eq '^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$'; then
    echo "دامنه نامعتبره: $DOMAIN" >&2
    exit 1
fi

command -v openssl >/dev/null 2>&1 || { echo "openssl پیدا نشد" >&2; exit 1; }

ROOT_DIR="$OUT_BASE/_rootCA"
OUT_DIR="$OUT_BASE/$DOMAIN"
mkdir -p "$ROOT_DIR" "$OUT_DIR"

if [[ ! -f "$ROOT_DIR/rootCA.crt" || ! -f "$ROOT_DIR/rootCA.key" ]]; then
    openssl req -x509 -new -nodes -newkey rsa:4096 \
        -keyout "$ROOT_DIR/rootCA.key" -out "$ROOT_DIR/rootCA.crt" \
        -sha256 -days 3650 \
        -subj "/C=US/ST=State/L=City/O=Xray Guard Local CA/CN=Xray-Guard-Root-CA" \
        -addext "basicConstraints=critical,CA:TRUE" \
        -addext "keyUsage=critical,keyCertSign,cRLSign" 2>/dev/null
    chmod 600 "$ROOT_DIR/rootCA.key"
    chmod 644 "$ROOT_DIR/rootCA.crt"
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cat > "$WORK/openssl.cnf" <<CONF
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn

[dn]
C  = US
ST = State
L  = City
O  = Development
CN = $DOMAIN
CONF

cat > "$WORK/ext.cnf" <<EXT
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = $DOMAIN
DNS.2 = *.$DOMAIN
EXT

openssl req -new -nodes -newkey rsa:2048 \
    -keyout "$OUT_DIR/privkey.pem" -out "$WORK/server.csr" \
    -config "$WORK/openssl.cnf" 2>/dev/null

openssl x509 -req -in "$WORK/server.csr" \
    -CA "$ROOT_DIR/rootCA.crt" -CAkey "$ROOT_DIR/rootCA.key" \
    -CAcreateserial -CAserial "$ROOT_DIR/rootCA.srl" \
    -out "$OUT_DIR/cert.pem" -days 3650 -sha256 \
    -extfile "$WORK/ext.cnf" 2>/dev/null

cat "$OUT_DIR/cert.pem" "$ROOT_DIR/rootCA.crt" > "$OUT_DIR/fullchain.pem"
cp "$ROOT_DIR/rootCA.crt" "$OUT_DIR/rootCA.crt"
chmod 644 "$OUT_DIR"/*.pem "$OUT_DIR/rootCA.crt"
chmod 600 "$OUT_DIR/privkey.pem"

if [[ ! -s "$OUT_DIR/fullchain.pem" || ! -s "$OUT_DIR/privkey.pem" ]]; then
    echo "ساخت گواهی برای $DOMAIN شکست خورد" >&2
    exit 1
fi

echo "$OUT_DIR/fullchain.pem"
echo "$OUT_DIR/privkey.pem"
