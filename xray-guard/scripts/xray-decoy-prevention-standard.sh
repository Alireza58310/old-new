#!/usr/bin/env bash
#
# xray-decoy-prevention-standard.sh - node-side protection against Xray-decoy.
#
# Designed by Yrust: https://t.me/PdYrust
#
# What Xray-decoy does (short version):
#   An authenticated user sends small DNS-over-TCP queries (DNSKEY, and
#   optionally TXT) for public resolvers through the proxy tunnel. The
#   node forwards them to the resolver, the large answer comes back to
#   the node and is discarded there, and the node's bandwidth is burned
#   without the traffic ever reaching the user or their quota.
#
# How this script stops it:
#   1. dnsdist listens on 127.0.0.1:5353 and refuses DNSKEY (and TXT)
#      queries on the spot, before they reach any resolver. Normal DNS
#      (A, AAAA, CNAME, MX, ...) is forwarded to the upstream resolver.
#   2. iptables redirects ALL outbound DNS (TCP and UDP, port 53, any
#      destination) to dnsdist, so the filter cannot be bypassed by
#      choosing another resolver. Port 853 (DNS-over-TLS) is dropped.
#   3. Both the host chain (OUTPUT) and the container chain (PREROUTING
#      for Docker bridge networks) are covered, so the same script works
#      whether the core runs directly on the host, in a host-network
#      container, or in a bridge-network container. The panel and the
#      core do not matter: filtering happens in the operating system,
#      below them. That is why one script covers PasarGuard, Marzban,
#      3x-ui, S-UI, and a plain Xray or sing-box install.
#
# This is the STANDARD edition: it refuses only DNSKEY and TXT queries
# (TXT can be turned off with BLOCK_TXT=0 below). Everything else — A,
# AAAA, CNAME, MX, and normal TCP DNS — passes through dnsdist and is
# answered. For a stricter edition that also refuses ANY, RRSIG, NSEC
# and NSEC3 and rejects all TCP DNS outright, see
# xray-decoy-prevention-strict.sh. Do not install both editions at
# once: to switch, run the installed edition's --uninstall first,
# then install the other one.
#
# Built on the v1 method (dnsdist + iptables redirect) with the
# v2-fixed corrections: --check never changes the firewall, TCP DNS
# is filtered instead of blocked, the boot unit orders after Docker,
# old v1 saved rules are cleaned up, failed verification rolls the
# firewall rules back, and bridge mode makes dnsdist listen on the
# bridge gateway addresses too (with addLocal, for every docker0 and
# br-* bridge found — the earlier single-docker0 version could miss
# custom bridge networks), and the dnsdist configuration file is
# always left readable to the dnsdist user (an earlier revision could
# restore it unreadable on --uninstall, which stopped dnsdist and
# broke the next install).
#
# Requirements:
#   - Ubuntu or Debian, systemd, iptables, root access.
#   - Run on the NODE server, on every node. If the panel runs on a
#     separate server, running this there does nothing for the node.
#   - No Docker, panel, or core changes are needed.
#
# Usage:
#   sudo ./xray-decoy-prevention-standard.sh            install (or re-run safely)
#   sudo ./xray-decoy-prevention-standard.sh --check    verify only, change nothing
#   sudo ./xray-decoy-prevention-standard.sh --uninstall
#                                              remove the protection again
#
#   The script is idempotent: running it again changes nothing if the
#   protection is already in place. The original dnsdist configuration
#   is backed up once to /etc/dnsdist/dnsdist.conf.orig.
#
# Tested on: Ubuntu 24.04 with dnsdist 1.8.3, on a real PasarGuard
# node (Docker, host network): install, --check, --uninstall and
# reinstall were all run on the node, and DNSKEY/TXT were refused
# while normal TCP and UDP DNS answered, from the host and from
# inside the node container. The v1 method was also tested in a lab
# against the real decoy binary. S-UI itself was not lab-tested,
# but this script never touches the panel or the core, so the same
# operating-system path applies.
#
# Known limits (read before relying on this):
#   - DNS-over-HTTPS (port 443) is encrypted web traffic and is not
#     filtered. The current decoy uses plain DNS on TCP port 53 only.
#   - Blocking TXT can break legitimate services that need TXT records
#     (for example SPF checks). Set BLOCK_TXT=0 below to block DNSKEY
#     only, then test before blocking TXT as well.
#   - dnsdist becomes part of the node's DNS path. It runs under
#     systemd with Restart=always, but monitor it like any other node
#     service: if dnsdist is down, node DNS through it stops.
#   - The global query cap (QPS_LIMIT) drops DNS above that rate for
#     the whole node. Raise it if legitimate DNS is dropped under load.
#   - Bridge mode (ENABLE_BRIDGE_RULES=1) is untested on a real node.
#     Test it on a test node first, and re-run this script after
#     creating a new Docker bridge network, so dnsdist listens on
#     the new bridge gateway address too.
#
# Output is plain text on purpose: no colors, no progress bars. Every
# line starts with [..], [OK], [WARN], or [FAIL], so the result is easy
# to read in a terminal and in a saved log alike.

set -euo pipefail

# ---------------------------------------------------------------------------
# Settings. Change these before running if you need different values.
# ---------------------------------------------------------------------------

DNSDIST_PORT=5353
UPSTREAM_RESOLVER="1.1.1.1"   # plain Cloudflare. 1.1.1.3 would also block malware domains.
UPSTREAM_RESOLVER2="1.0.0.1"  # second upstream (failover); empty = none
QPS_LIMIT=2000         # node-wide DNS cap; raise it on very busy nodes
CACHE_ENTRIES=20000    # dnsdist answer cache (0 = off); makes DNS faster
BLOCK_TXT=1            # 1 = refuse TXT as well as DNSKEY, 0 = DNSKEY only
BLOCK_TCP_DNS=0        # 0 = filter TCP DNS through dnsdist (DNSKEY/TXT refused,
                       # normal TCP DNS answered) — the v1 behaviour, keep this.
                       # 1 = reject ALL outbound TCP DNS ports below. Only use
                       # 1 if you accept that normal TCP DNS breaks too.
TCP_DNS_PORTS="53,853,5353"   # comma-separated TCP ports to reject (only if BLOCK_TCP_DNS=1)
ENABLE_BRIDGE_RULES=0  # 1 only if the core runs in a Docker BRIDGE network
                       # (PasarGuard nodes normally use host network: keep 0)
                       # Bridge mode is untested on a real node: test first.
BRIDGE_IP=""           # empty = auto-detect every bridge gateway address
                       # (docker0 and br-*); set one address by hand if
                       # detection is wrong. Only used when
                       # ENABLE_BRIDGE_RULES=1.

RULES_UNIT="/etc/systemd/system/xray-decoy-dns.service"
INSTALLED_COPY="/usr/local/sbin/xray-decoy-prevention.sh"

DNSDIST_CONF="/etc/dnsdist/dnsdist.conf"
DNSDIST_BACKUP="/etc/dnsdist/dnsdist.conf.orig"
OVERRIDE_DIR="/etc/systemd/system/dnsdist.service.d"
OVERRIDE_FILE="$OVERRIDE_DIR/override.conf"
BRIDGE_NET="172.16.0.0/12"

# Internal state, set while the script runs.
CONFIG_CHANGED=0
VERIFY_FAILED=0
CHECK_FAILED=0
LAST_CHECK=""

# ---------------------------------------------------------------------------
# Output helpers.
# ---------------------------------------------------------------------------

log()  { printf '[..] %s\n' "$*"; }
ok()   { printf '[OK] %s\n' "$*"; }
warn() { printf '[WARN] %s\n' "$*" >&2; }
die()  { printf '[FAIL] %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Preconditions.
# ---------------------------------------------------------------------------

require_root() {
    [[ "${EUID:-$(id -u)}" == "0" ]] || die "run this script as root (for example: sudo $0)"
}

require_command() {
    command -v "$1" >/dev/null 2>&1 || die "required command not found: $1"
}

# ---------------------------------------------------------------------------
# Detection.
# ---------------------------------------------------------------------------

# IPv6 loopback available? Only then do we listen on [::1] and add v6 rules.
ipv6_loopback_ok() {
    [[ -r /proc/net/if_inet6 ]] && grep -q '^00000000000000000000000000000001 ' /proc/net/if_inet6
}

# dnsdist's own upstream queries must bypass the redirect (see the owner
# rule in for_each_rule), which needs the user dnsdist runs as. On
# Ubuntu/Debian that is _dnsdist; never assume, always look it up.
detect_dnsdist_uid() {
    local uid=""
    if command -v id >/dev/null 2>&1; then
        uid="$(id -u _dnsdist 2>/dev/null || id -u dnsdist 2>/dev/null || true)"
    fi
    if [[ -z "$uid" || "$uid" == "0" ]]; then
        die "dnsdist does not run as a dedicated non-root user on this system; refusing to install the redirect (it would loop). Check the dnsdist service user and try again."
    fi
    printf '%s\n' "$uid"
}

# Bridge gateway addresses (docker0 and every br-* bridge), so dnsdist
# can listen on them when bridge rules are enabled. A PREROUTING
# REDIRECT sends bridge DNS to the gateway address of the bridge the
# packet arrived on, not to 127.0.0.1, so dnsdist must listen on every
# bridge gateway, not just docker0. Prints a space-separated list, or
# nothing when no bridge address is found. Validation happens in
# cmd_install, before anything is written.
detect_bridge_ips() {
    local ips=""
    if [[ -n "$BRIDGE_IP" ]]; then
        ips="$BRIDGE_IP"
    elif command -v ip >/dev/null 2>&1; then
        ips="$(ip -4 -o addr show 2>/dev/null | awk '$2 ~ /^(docker0|br-)/ && $3 == "inet" {split($4, a, "/"); print a[1]}' | tr '\n' ' ' || true)"
    fi
    printf '%s\n' "$ips"
}

# Informational only: show how the containers on this host are networked,
# so the operator can see whether bridge rules are even relevant here.
show_environment() {
    if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
        log "docker containers and their network modes:"
        local name=""
        local mode=""
        docker ps --format '{{.Names}}' | while read -r name; do
            mode="$(docker inspect "$name" --format '{{.HostConfig.NetworkMode}}' 2>/dev/null || echo unknown)"
            log "  $name: $mode"
        done
    else
        log "docker not found or not running; host rules still apply."
    fi
}

# ---------------------------------------------------------------------------
# dnsdist installation and configuration.
# ---------------------------------------------------------------------------

install_packages() {
    log "installing packages (dnsdist, dnsutils)..."
    require_command apt-get
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y -qq dnsdist dnsutils
    ok "packages installed"
}

# dnsdist runs as an unprivileged user (_dnsdist), so it must be able
# to read its configuration file. Two traps hide here: restoring the
# backup with "cp -a" keeps the backup's restrictive mode (the
# packaged file is 640 root:root, which _dnsdist cannot read), and
# writing with "cat > file" keeps the existing file's mode. So every
# place that writes or restores the file must set the mode explicitly
# afterwards. The file holds no secrets (listens, upstreams, filter
# rules), so 644 is safe.
ensure_dnsdist_conf_readable() {
    chmod 644 "$DNSDIST_CONF"
}

# Write the dnsdist configuration, but only replace the file when the
# content actually changed, so a re-run never restarts dnsdist for
# nothing. Sets CONFIG_CHANGED=1 when the file was replaced.
write_dnsdist_config() {
    local bridge_ips="${1:-}"
    local tmp=""
    tmp="$(mktemp)"
    {
        printf '%s\n' "-- Generated by xray-decoy-prevention-standard.sh (original: $DNSDIST_BACKUP)."
        printf 'setLocal("127.0.0.1:%s")\n' "$DNSDIST_PORT"
        local bip=""
        # Word-splitting on the space-separated list is intended here.
        for bip in $bridge_ips; do
            printf '%s\n' "-- Bridge gateway: PREROUTING REDIRECT sends bridge DNS here."
            printf 'addLocal("%s:%s")\n' "$bip" "$DNSDIST_PORT"
        done
        if ipv6_loopback_ok; then
            printf 'addLocal("[::1]:%s")\n' "$DNSDIST_PORT"
        fi
        printf '%s\n' "-- dnsdist listens only on local addresses (loopback, plus"
        printf '%s\n' "-- bridge gateways when bridge rules are enabled), never on a"
        printf '%s\n' "-- public interface, so nothing outside this server can reach"
        printf '%s\n' "-- it directly. Accepting any source here is therefore safe,"
        printf '%s\n' "-- and it keeps working if the server has several or changing"
        printf '%s\n' "-- addresses."
        printf 'addACL("0.0.0.0/0")\n'
        printf 'addACL("::/0")\n'
        printf 'newServer({address="%s:53", name="upstream1"})\n' "$UPSTREAM_RESOLVER"
        if [[ -n "$UPSTREAM_RESOLVER2" ]]; then
            printf 'newServer({address="%s:53", name="upstream2"})\n' "$UPSTREAM_RESOLVER2"
        fi
        if [[ "$CACHE_ENTRIES" -gt 0 ]]; then
            printf 'pc = newPacketCache(%s, {maxTTL=300, minTTL=5})\n' "$CACHE_ENTRIES"
            printf 'getPool(""):setCache(pc)\n'
        fi
        printf '%s\n' ""
        printf '%s\n' "-- Decoy queries: refused here, before they reach any resolver."
        printf 'addAction(QTypeRule(DNSQType.DNSKEY), RCodeAction(DNSRCode.REFUSED))\n'
        if [[ "$BLOCK_TXT" == "1" ]]; then
            printf 'addAction(QTypeRule(DNSQType.TXT), RCodeAction(DNSRCode.REFUSED))\n'
        else
            printf '%s\n' "-- TXT blocking is disabled (BLOCK_TXT=0)."
        fi
        printf '%s\n' "-- Global query cap. MaxQPSRule matches queries BELOW the limit,"
        printf '%s\n' "-- so the cap needs NotRule: only queries above it are dropped."
        printf 'addAction(NotRule(MaxQPSRule(%s)), DropAction())\n' "$QPS_LIMIT"
    } > "$tmp"
    if [[ -f "$DNSDIST_CONF" ]] && cmp -s "$tmp" "$DNSDIST_CONF"; then
        rm -f "$tmp"
        CONFIG_CHANGED=0
        ensure_dnsdist_conf_readable
        log "dnsdist configuration is already up to date"
        return 0
    fi
    if [[ -f "$DNSDIST_CONF" && ! -f "$DNSDIST_BACKUP" ]]; then
        cp -a "$DNSDIST_CONF" "$DNSDIST_BACKUP"
        ok "original configuration backed up to $DNSDIST_BACKUP"
    fi
    cat "$tmp" > "$DNSDIST_CONF"
    rm -f "$tmp"
    ensure_dnsdist_conf_readable
    CONFIG_CHANGED=1
    ok "dnsdist configuration written to $DNSDIST_CONF"
}

configure_dnsdist_service() {
    log "enabling dnsdist with Restart=always..."
    mkdir -p "$OVERRIDE_DIR"
    printf '[Service]\nRestart=always\nRestartSec=2\n' > "$OVERRIDE_FILE"
    systemctl daemon-reload
    systemctl enable dnsdist >/dev/null
    if [[ "$CONFIG_CHANGED" == "1" ]] || [[ "$(systemctl is-active dnsdist 2>/dev/null || true)" != "active" ]]; then
        systemctl restart dnsdist || true
    fi
    local attempt=1
    while [[ "$attempt" -le 5 ]]; do
        if [[ "$(systemctl is-active dnsdist 2>/dev/null || true)" == "active" ]]; then
            ok "dnsdist is active"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    warn "dnsdist did not start with the new configuration; restoring the backup..."
    if [[ -f "$DNSDIST_BACKUP" ]]; then
        cp -a "$DNSDIST_BACKUP" "$DNSDIST_CONF"
        ensure_dnsdist_conf_readable
        systemctl restart dnsdist || true
    fi
    die "dnsdist failed to start. The previous configuration was restored (if a backup existed). Check: journalctl -u dnsdist"
}

# ---------------------------------------------------------------------------
# Firewall rules.
#
# Every rule this script owns is listed once, in for_each_rule. Install,
# uninstall, and --check all go through that one list, so they can never
# drift apart. Rules are added only if missing and removed only if
# present, which is what makes the script safe to re-run.
# ---------------------------------------------------------------------------

chain_exists() {
    iptables -L "$1" -n >/dev/null 2>&1
}

ipv6_usable() {
    ipv6_loopback_ok && command -v ip6tables >/dev/null 2>&1 && ip6tables -t nat -L OUTPUT -n >/dev/null 2>&1
}

ensure_rule() {
    local binary="$1" table="$2" chain="$3"
    shift 3
    if ! "$binary" -t "$table" -C "$chain" "$@" 2>/dev/null; then
        case " $* " in
            # The owner/RETURN rule must stay first, or dnsdist's own
            # upstream queries would loop back into dnsdist.
            *" -j RETURN "*) "$binary" -t "$table" -I "$chain" 1 "$@" ;;
            *)               "$binary" -t "$table" -A "$chain" "$@" ;;
        esac
    fi
}

remove_rule() {
    local binary="$1" table="$2" chain="$3"
    shift 3
    while "$binary" -t "$table" -C "$chain" "$@" 2>/dev/null; do
        "$binary" -t "$table" -D "$chain" "$@" || break
    done
}

cb_report() {
    local binary="$1" table="$2" chain="$3"
    shift 3
    if "$binary" -t "$table" -C "$chain" "$@" 2>/dev/null; then
        ok "present: $binary -t $table $chain $*"
    else
        warn "missing: $binary -t $table $chain $*"
        CHECK_FAILED=1
    fi
}

# Report a rule that should NOT be present (used by --check only).
# Never changes anything: present = problem, absent = as expected.
cb_report_absent() {
    local binary="$1" table="$2" chain="$3"
    shift 3
    if "$binary" -t "$table" -C "$chain" "$@" 2>/dev/null; then
        warn "unexpectedly present: $binary -t $table $chain $*"
        CHECK_FAILED=1
    else
        ok "absent as expected: $binary -t $table $chain $*"
    fi
}

for_each_rule() {
    local callback="$1" uid="$2"
    # Host-originated traffic: cores on the host and host-network
    # containers. The owner rule first: dnsdist's own upstream queries
    # must bypass the redirect, or they loop back into dnsdist.
    if [[ -n "$uid" ]]; then
        "$callback" iptables nat OUTPUT -m owner --uid-owner "$uid" -j RETURN
    fi
    # TCP DNS: with BLOCK_TCP_DNS=1 the TCP redirects are not needed (TCP is
    # rejected outright below), and any old ones are cleaned up. With
    # BLOCK_TCP_DNS=0 the TCP rejects are not needed and are cleaned up.
    # --check (cb_report) must NEVER change anything, so in check mode the
    # "should be absent" side reports absence instead of removing rules.
    local tcp_redirect_cb="$callback" tcp_reject_cb="$callback"
    if [[ "$BLOCK_TCP_DNS" == "1" ]]; then
        if [[ "$callback" == "cb_report" ]]; then tcp_redirect_cb="cb_report_absent"; else tcp_redirect_cb="remove_rule"; fi
    else
        if [[ "$callback" == "cb_report" ]]; then tcp_reject_cb="cb_report_absent"; else tcp_reject_cb="remove_rule"; fi
    fi
    "$tcp_redirect_cb" iptables nat OUTPUT -p tcp --dport 53 -j REDIRECT --to-ports "$DNSDIST_PORT"
    "$callback" iptables nat OUTPUT -p udp --dport 53 -j REDIRECT --to-ports "$DNSDIST_PORT"
    # Reject every outbound TCP DNS port (loopback excluded so dnsdist's
    # own port stays reachable; dnsdist itself is exempt via its uid).
    if [[ -n "$uid" ]]; then
        "$tcp_reject_cb" iptables filter OUTPUT -m owner --uid-owner "$uid" -j RETURN
    fi
    "$tcp_reject_cb" iptables filter OUTPUT -p tcp -m multiport --dports "$TCP_DNS_PORTS" ! -o lo -j REJECT --reject-with tcp-reset
    # Bridge-network containers: their traffic enters via PREROUTING,
    # never via the host OUTPUT chain. Off by default: a REDIRECT there
    # points at the bridge address, not 127.0.0.1, so it needs extra
    # setup. Removal always runs so old rules never get stranded.
    if [[ "$ENABLE_BRIDGE_RULES" == "1" || "$callback" == "remove_rule" ]]; then
        "$callback" iptables nat PREROUTING -s "$BRIDGE_NET" -p tcp --dport 53 -j REDIRECT --to-ports "$DNSDIST_PORT"
        "$callback" iptables nat PREROUTING -s "$BRIDGE_NET" -p udp --dport 53 -j REDIRECT --to-ports "$DNSDIST_PORT"
    fi
    # DNS-over-TLS must not become a bypass around the filter.
    "$callback" iptables filter OUTPUT -p tcp --dport 853 -j DROP
    "$callback" iptables filter OUTPUT -p udp --dport 853 -j DROP
    if chain_exists DOCKER-USER; then
        "$tcp_reject_cb" iptables filter DOCKER-USER -s "$BRIDGE_NET" -p tcp -m multiport --dports "$TCP_DNS_PORTS" -j REJECT --reject-with tcp-reset
        "$callback" iptables filter DOCKER-USER -s "$BRIDGE_NET" -p tcp --dport 853 -j DROP
        "$callback" iptables filter DOCKER-USER -s "$BRIDGE_NET" -p udp --dport 853 -j DROP
    fi
    if ipv6_usable; then
        if [[ -n "$uid" ]]; then
            "$callback" ip6tables nat OUTPUT -m owner --uid-owner "$uid" -j RETURN
        fi
        "$tcp_redirect_cb" ip6tables nat OUTPUT -p tcp --dport 53 -j REDIRECT --to-ports "$DNSDIST_PORT"
        "$callback" ip6tables nat OUTPUT -p udp --dport 53 -j REDIRECT --to-ports "$DNSDIST_PORT"
        if [[ -n "$uid" ]]; then
            "$tcp_reject_cb" ip6tables filter OUTPUT -m owner --uid-owner "$uid" -j RETURN
        fi
        "$tcp_reject_cb" ip6tables filter OUTPUT -p tcp -m multiport --dports "$TCP_DNS_PORTS" ! -o lo -j REJECT --reject-with tcp-reset
        "$callback" ip6tables filter OUTPUT -p tcp --dport 853 -j DROP
        "$callback" ip6tables filter OUTPUT -p udp --dport 853 -j DROP
    fi
}

# Boot persistence without iptables-persistent: a small oneshot unit that
# re-applies ONLY this script's rules after dnsdist is up. Saving the whole
# firewall (as netfilter-persistent does) can clash with Docker's own rules.
install_boot_unit() {
    local self=""
    self="$(readlink -f "${BASH_SOURCE[0]}")"
    if [[ "$self" != "$INSTALLED_COPY" ]]; then
        install -m 755 "$self" "$INSTALLED_COPY"
    fi
    cat > "$RULES_UNIT" <<UNIT
[Unit]
Description=Xray-decoy DNS redirect rules
Requires=dnsdist.service
# After docker.service: without this, the DOCKER-USER rules can be
# silently skipped at boot because the chain does not exist yet.
# (After only orders the start; it does not require Docker to be
# installed — on a host without Docker this is simply ignored.)
After=dnsdist.service docker.service network.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=$INSTALLED_COPY --apply-rules
ExecStop=$INSTALLED_COPY --remove-rules

[Install]
WantedBy=multi-user.target
UNIT
    systemctl daemon-reload
    systemctl enable xray-decoy-dns.service >/dev/null 2>&1
    ok "boot unit installed: rules are re-applied after every reboot"
}

# ---------------------------------------------------------------------------
# Old saved rules (v1 used iptables-persistent).
# ---------------------------------------------------------------------------

# v1 saved its rules with netfilter-persistent. If that saved file still
# holds our port-5353 rules, they can fight the boot unit or come back
# after --uninstall and a reboot. Strip only our rules (lines with
# 5353) from the saved files, keeping a backup of the original file.
# The live firewall is untouched by this function.
cleanup_persistent_rules() {
    local file=""
    for file in /etc/iptables/rules.v4 /etc/iptables/rules.v6; do
        if [[ -f "$file" ]] && grep -q '5353' "$file" 2>/dev/null; then
            if [[ ! -f "$file.xray-decoy-v1-backup" ]]; then
                cp -a "$file" "$file.xray-decoy-v1-backup"
                log "saved iptables-persistent file backed up to $file.xray-decoy-v1-backup"
            fi
            grep -v '5353' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
            ok "removed our old port-5353 rules from saved file $file"
        fi
    done
}

# ---------------------------------------------------------------------------
# Verification. Uses dig only: no attack traffic, no panel access, no API.
# ---------------------------------------------------------------------------

# dig_status <tcp|udp> <type> <name> <resolver> [port]
# Prints the DNS status (NOERROR, REFUSED, ...) or NO-REPLY.
dig_status() {
    local proto="$1" qtype="$2" name="$3" resolver="$4" port="${5:-53}"
    local proto_flag="+tcp"
    local out=""
    local status=""
    if [[ "$proto" == "udp" ]]; then
        proto_flag="+notcp"
    fi
    out="$(LC_ALL=C dig "$proto_flag" +time=3 +tries=1 "$qtype" "$name" "@$resolver" -p "$port" 2>/dev/null || true)"
    status="$(printf '%s\n' "$out" | awk '/status:/ {gsub(/,/, "", $6); print $6; exit}' || true)"
    if [[ -z "$status" ]]; then
        status="NO-REPLY"
    fi
    printf '%s\n' "$status"
}

# check_dns <description> <expected status> <actual status>
# Sets LAST_CHECK to ok, warn, or fail. A wrong answer is a failure; no
# reply at all is only a warning, because a single resolver may simply
# be unreachable from this server. verify_protection additionally
# requires at least one resolver check to succeed, so a broken redirect
# (everything silent) cannot pass as a set of warnings.
check_dns() {
    local description="$1" expected="$2" actual="$3"
    if [[ "$actual" == "$expected" ]]; then
        ok "$description: $actual"
        LAST_CHECK="ok"
    elif [[ "$actual" == "NO-REPLY" ]]; then
        warn "$description: no reply (that resolver may be unreachable from this server)"
        LAST_CHECK="warn"
    else
        warn "$description: got $actual, expected $expected"
        LAST_CHECK="fail"
        VERIFY_FAILED=1
    fi
}

verify_protection() {
    log "verifying: decoy queries must be REFUSED, normal DNS must answer..."
    require_command dig
    VERIFY_FAILED=0
    local resolver_proof=0
    local resolver=""
    local actual=""

    # Direct checks against dnsdist itself (no network involved).
    actual="$(dig_status tcp DNSKEY . 127.0.0.1 "$DNSDIST_PORT")"
    check_dns "DNSKEY . via dnsdist directly" "REFUSED" "$actual"
    actual="$(dig_status tcp A google.com 127.0.0.1 "$DNSDIST_PORT")"
    check_dns "A google.com via dnsdist directly" "NOERROR" "$actual"

    if ipv6_usable; then
        actual="$(dig_status tcp DNSKEY . ::1 "$DNSDIST_PORT")"
        check_dns "DNSKEY . via dnsdist on [::1]" "REFUSED" "$actual"
    fi

    if [[ "$BLOCK_TCP_DNS" == "1" ]]; then
        # TCP DNS must be rejected; UDP must still be filtered and answered.
        actual="$(dig_status tcp A google.com 8.8.8.8)"
        if [[ "$actual" == "NO-REPLY" ]]; then
            ok "TCP DNS to 8.8.8.8 is blocked"
        else
            warn "TCP DNS to 8.8.8.8 was NOT blocked (got $actual)"
            VERIFY_FAILED=1
        fi
        for resolver in 8.8.8.8 9.9.9.9 77.88.8.8 223.5.5.5; do
            actual="$(dig_status udp DNSKEY org. "$resolver")"
            check_dns "UDP DNSKEY org. via $resolver" "REFUSED" "$actual"
            if [[ "$LAST_CHECK" == "ok" ]]; then
                resolver_proof=$((resolver_proof + 1))
            fi
        done
        if [[ "$BLOCK_TXT" == "1" ]]; then
            actual="$(dig_status udp TXT example.com 8.8.8.8)"
            check_dns "UDP TXT example.com via 8.8.8.8" "REFUSED" "$actual"
        fi
    else
        # Redirect checks: the same query to different resolvers must all
        # hit the filter, whatever resolver address is used.
        for resolver in 8.8.8.8 9.9.9.9 77.88.8.8 223.5.5.5; do
            actual="$(dig_status tcp DNSKEY . "$resolver")"
            check_dns "TCP DNSKEY . via $resolver" "REFUSED" "$actual"
            if [[ "$LAST_CHECK" == "ok" ]]; then
                resolver_proof=$((resolver_proof + 1))
            fi
        done
        if [[ "$BLOCK_TXT" == "1" ]]; then
            actual="$(dig_status tcp TXT example.com 8.8.8.8)"
            check_dns "TCP TXT example.com via 8.8.8.8" "REFUSED" "$actual"
        fi
        actual="$(dig_status tcp A google.com 8.8.8.8)"
        check_dns "TCP A google.com via 8.8.8.8" "NOERROR" "$actual"
        actual="$(dig_status udp DNSKEY org. 8.8.8.8)"
        check_dns "UDP DNSKEY org. via 8.8.8.8" "REFUSED" "$actual"
    fi
    actual="$(dig_status udp A google.com 8.8.8.8)"
    check_dns "UDP A google.com via 8.8.8.8" "NOERROR" "$actual"

    if [[ "$VERIFY_FAILED" == "1" ]]; then
        die "verification failed: at least one check returned the wrong answer. Check the output above and: journalctl -u dnsdist"
    fi
    if [[ "$resolver_proof" == "0" ]]; then
        die "verification failed: no public resolver check succeeded, so the redirect could not be confirmed. Check the network path and the dnsdist configuration ($DNSDIST_CONF)."
    fi
    ok "verification passed"
}

# ---------------------------------------------------------------------------
# Commands.
# ---------------------------------------------------------------------------

cmd_install() {
    require_root
    require_command systemctl
    require_command iptables
    log "protecting this node against Xray-decoy (dnsdist + iptables)..."
    show_environment
    install_packages
    local uid=""
    uid="$(detect_dnsdist_uid)"
    log "dnsdist uid: $uid"
    local bridge_ips=""
    if [[ "$ENABLE_BRIDGE_RULES" == "1" ]]; then
        bridge_ips="$(detect_bridge_ips)"
        if [[ -z "${bridge_ips// /}" ]]; then
            die "bridge rules are enabled but no bridge gateway address could be detected. Set BRIDGE_IP at the top of the script and run it again."
        fi
        local bip=""
        for bip in $bridge_ips; do
            [[ "$bip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "invalid bridge gateway address: $bip. Check BRIDGE_IP at the top of the script."
        done
        log "bridge gateways: $bridge_ips"
    fi
    write_dnsdist_config "$bridge_ips"
    configure_dnsdist_service
    log "applying firewall rules..."
    for_each_rule ensure_rule "$uid"
    ok "firewall rules applied"
    # If verification fails, take the redirect out again so the node's
    # DNS is never left broken.
    if ! ( verify_protection ); then
        for_each_rule remove_rule "$uid"
        die "verification failed, so the firewall rules were REMOVED again and DNS is direct as before. Check: journalctl -u dnsdist"
    fi
    cleanup_persistent_rules
    install_boot_unit
    ok "done: decoy DNS queries are refused on this node; normal DNS still works."
    log "to verify later: $0 --check ; to remove: $0 --uninstall"
}

# Used by the boot unit.
cmd_apply_rules() {
    require_root
    local uid=""
    uid="$(detect_dnsdist_uid)"
    for_each_rule ensure_rule "$uid"
}

cmd_remove_rules() {
    require_root
    local uid=""
    uid="$(id -u _dnsdist 2>/dev/null || id -u dnsdist 2>/dev/null || true)"
    for_each_rule remove_rule "$uid"
}

cmd_check() {
    require_root
    require_command iptables
    local status=""
    status="$(systemctl is-active dnsdist 2>/dev/null || true)"
    [[ -n "$status" ]] || status="not-running"
    log "dnsdist service: $status"
    local uid=""
    uid="$(id -u _dnsdist 2>/dev/null || id -u dnsdist 2>/dev/null || true)"
    local verify_ok=1
    CHECK_FAILED=0
    # --check changes nothing: cb_report only reports, and verification
    # runs in a subshell so its failure cannot hide missing rules.
    for_each_rule cb_report "$uid"
    if ! ( verify_protection ); then
        verify_ok=0
    fi
    if [[ "$CHECK_FAILED" == "1" ]]; then
        die "some firewall rules are missing or unexpected; run the script without arguments to install them."
    fi
    if [[ "$verify_ok" == "0" ]]; then
        die "verification failed: at least one DNS check returned the wrong answer. Check the output above and: journalctl -u dnsdist"
    fi
    ok "protection looks good"
}

cmd_uninstall() {
    require_root
    require_command iptables
    log "removing Xray-decoy protection..."
    local uid=""
    uid="$(detect_dnsdist_uid 2>/dev/null || true)"
    for_each_rule remove_rule "$uid"
    ok "firewall rules removed"
    cleanup_persistent_rules
    systemctl disable xray-decoy-dns.service >/dev/null 2>&1 || true
    rm -f "$RULES_UNIT"
    rm -f "$INSTALLED_COPY"
    rm -rf "$OVERRIDE_DIR"
    systemctl daemon-reload || true
    if [[ -f "$DNSDIST_BACKUP" ]]; then
        cp -a "$DNSDIST_BACKUP" "$DNSDIST_CONF"
        ensure_dnsdist_conf_readable
        systemctl restart dnsdist || true
        local restored=0
        local attempt=1
        while [[ "$attempt" -le 3 ]]; do
            if [[ "$(systemctl is-active dnsdist 2>/dev/null || true)" == "active" ]]; then
                restored=1
                break
            fi
            attempt=$((attempt + 1))
            sleep 1
        done
        if [[ "$restored" == "1" ]]; then
            ok "original dnsdist configuration restored"
        else
            die "dnsdist did not start with the restored configuration. The firewall rules were removed, but dnsdist is not running. Check: journalctl -u dnsdist"
        fi
    elif systemctl list-unit-files dnsdist.service >/dev/null 2>&1; then
        systemctl stop dnsdist || true
        systemctl disable dnsdist || true
        ok "dnsdist stopped and disabled (no backup configuration existed)"
    fi
    ok "protection removed; outbound DNS is direct again"
}

usage() {
    cat <<'USAGE'
Usage: xray-decoy-prevention-standard.sh [--check | --uninstall | --apply-rules | --remove-rules | --help]

  (no argument)   install the protection and verify it
  --check         verify only; change nothing
  --uninstall     remove the protection and restore the previous setup
  --apply-rules   (used by the boot unit) apply the firewall rules only
  --remove-rules  (used by the boot unit) remove the firewall rules only
  --help          show this help
USAGE
}

main() {
    case "${1:-}" in
        "") cmd_install ;;
        --check) cmd_check ;;
        --uninstall) cmd_uninstall ;;
        --apply-rules) cmd_apply_rules ;;
        --remove-rules) cmd_remove_rules ;;
        --help|-h) usage ;;
        *) usage >&2; die "unknown argument: $1" ;;
    esac
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
