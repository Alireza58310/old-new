from __future__ import annotations

import sqlite3
import threading
import time


class Storage:
    def __init__(self, path: str):
        self._path = path
        self._lock = threading.Lock()
        self._init_schema()

    def _conn(self):
        return sqlite3.connect(self._path)

    def _init_schema(self):
        with self._lock, self._conn() as c:
            c.execute("""
                CREATE TABLE IF NOT EXISTS metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    server TEXT, ts REAL,
                    rx_delta_bytes INTEGER, reported_delta_bytes INTEGER
                )""")
            c.execute("""
                CREATE TABLE IF NOT EXISTS alerts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    server TEXT, ts REAL, severity TEXT, kind TEXT,
                    message TEXT, suspects TEXT, resolved INTEGER DEFAULT 0
                )""")
            c.execute("""
                CREATE TABLE IF NOT EXISTS locks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    server TEXT, email TEXT, ts REAL, reason TEXT, active INTEGER DEFAULT 1
                )""")
            c.execute("""
                CREATE TABLE IF NOT EXISTS decoy_status (
                    server TEXT PRIMARY KEY,
                    edition TEXT, installed INTEGER, last_ok INTEGER,
                    ts REAL, action TEXT, output TEXT
                )""")
            c.execute("""
                CREATE TABLE IF NOT EXISTS ratelimit_status (
                    server TEXT PRIMARY KEY,
                    active INTEGER, mbit INTEGER, ts REAL
                )""")

    def add_metric(self, server: str, rx_delta: int, reported_delta: int):
        with self._lock, self._conn() as c:
            c.execute(
                "INSERT INTO metrics (server, ts, rx_delta_bytes, reported_delta_bytes) VALUES (?,?,?,?)",
                (server, time.time(), rx_delta, reported_delta),
            )

    def recent_metrics(self, server: str, limit: int = 200) -> list[dict]:
        with self._lock, self._conn() as c:
            rows = c.execute(
                "SELECT ts, rx_delta_bytes, reported_delta_bytes FROM metrics "
                "WHERE server=? ORDER BY ts DESC LIMIT ?",
                (server, limit),
            ).fetchall()
        return [{"ts": r[0], "rx_delta": r[1], "reported_delta": r[2]} for r in reversed(rows)]

    def add_alert(self, server: str, severity: str, kind: str, message: str, suspects: list[str]):
        with self._lock, self._conn() as c:
            c.execute(
                "INSERT INTO alerts (server, ts, severity, kind, message, suspects) VALUES (?,?,?,?,?,?)",
                (server, time.time(), severity, kind, message, ",".join(suspects)),
            )

    def recent_alerts(self, limit: int = 100) -> list[dict]:
        with self._lock, self._conn() as c:
            rows = c.execute(
                "SELECT id, server, ts, severity, kind, message, suspects, resolved "
                "FROM alerts ORDER BY ts DESC LIMIT ?",
                (limit,),
            ).fetchall()
        return [
            {
                "id": r[0], "server": r[1], "ts": r[2], "severity": r[3],
                "kind": r[4], "message": r[5], "suspects": r[6].split(",") if r[6] else [],
                "resolved": bool(r[7]),
            }
            for r in rows
        ]

    def add_lock(self, server: str, email: str, reason: str):
        with self._lock, self._conn() as c:
            c.execute(
                "INSERT INTO locks (server, email, ts, reason) VALUES (?,?,?,?)",
                (server, email, time.time(), reason),
            )

    def deactivate_lock(self, server: str, email: str):
        with self._lock, self._conn() as c:
            c.execute(
                "UPDATE locks SET active=0 WHERE server=? AND email=? AND active=1",
                (server, email),
            )

    def upsert_decoy_status(self, server: str, edition: str, installed: bool,
                             ok: bool, output: str, action: str):
        with self._lock, self._conn() as c:
            c.execute(
                "INSERT INTO decoy_status (server, edition, installed, last_ok, ts, action, output) "
                "VALUES (?,?,?,?,?,?,?) "
                "ON CONFLICT(server) DO UPDATE SET "
                "edition=excluded.edition, installed=excluded.installed, last_ok=excluded.last_ok, "
                "ts=excluded.ts, action=excluded.action, output=excluded.output",
                (server, edition, int(installed), int(ok), time.time(), action, output),
            )

    def get_decoy_status(self, server: str) -> dict | None:
        with self._lock, self._conn() as c:
            row = c.execute(
                "SELECT server, edition, installed, last_ok, ts, action, output "
                "FROM decoy_status WHERE server=?",
                (server,),
            ).fetchone()
        if not row:
            return None
        return {
            "server": row[0], "edition": row[1], "installed": bool(row[2]),
            "last_ok": bool(row[3]), "ts": row[4], "action": row[5], "output": row[6],
        }

    def list_decoy_status(self) -> list[dict]:
        with self._lock, self._conn() as c:
            rows = c.execute(
                "SELECT server, edition, installed, last_ok, ts, action, output FROM decoy_status"
            ).fetchall()
        return [
            {
                "server": r[0], "edition": r[1], "installed": bool(r[2]),
                "last_ok": bool(r[3]), "ts": r[4], "action": r[5], "output": r[6],
            }
            for r in rows
        ]

    def set_ratelimit(self, server: str, active: bool, mbit: int):
        with self._lock, self._conn() as c:
            c.execute(
                "INSERT INTO ratelimit_status (server, active, mbit, ts) VALUES (?,?,?,?) "
                "ON CONFLICT(server) DO UPDATE SET active=excluded.active, "
                "mbit=excluded.mbit, ts=excluded.ts",
                (server, int(active), mbit, time.time()),
            )

    def list_ratelimit(self) -> list[dict]:
        with self._lock, self._conn() as c:
            rows = c.execute(
                "SELECT server, active, mbit, ts FROM ratelimit_status"
            ).fetchall()
        return [{"server": r[0], "active": bool(r[1]), "mbit": r[2], "ts": r[3]} for r in rows]

    def active_locks(self) -> list[dict]:
        with self._lock, self._conn() as c:
            rows = c.execute(
                "SELECT server, email, ts, reason FROM locks WHERE active=1 ORDER BY ts DESC"
            ).fetchall()
        return [{"server": r[0], "email": r[1], "ts": r[2], "reason": r[3]} for r in rows]
