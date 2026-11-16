"""
اتصال SSH به سرورهای هدف. یه اتصال برای هر سرور نگه می‌داریم و در صورت قطعی
دوباره وصل می‌شیم. فقط همین ماژول دسترسی شبکه‌ی خروجی به سرورهای کاربر داره.
"""
from __future__ import annotations

import threading
import paramiko


class SSHPool:
    def __init__(self):
        self._clients: dict[str, paramiko.SSHClient] = {}
        self._lock = threading.Lock()

    def _connect(self, server_name: str, ssh_cfg: dict) -> paramiko.SSHClient:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        kwargs = dict(
            hostname=ssh_cfg["host"],
            port=ssh_cfg.get("port", 22),
            username=ssh_cfg["user"],
            timeout=10,
            banner_timeout=10,
        )
        if ssh_cfg.get("key_path"):
            kwargs["key_filename"] = ssh_cfg["key_path"]
        elif ssh_cfg.get("password"):
            kwargs["password"] = ssh_cfg["password"]
        else:
            raise ValueError(f"[{server_name}] نه key_path ست شده نه password")
        client.connect(**kwargs)
        return client

    def _get_client(self, server_name: str, ssh_cfg: dict) -> paramiko.SSHClient:
        with self._lock:
            client = self._clients.get(server_name)
            needs_connect = client is None
            if client is not None:
                transport = client.get_transport()
                needs_connect = transport is None or not transport.is_active()
            if needs_connect:
                client = self._connect(server_name, ssh_cfg)
                self._clients[server_name] = client
            return client

    def run_status(self, server_name: str, ssh_cfg: dict, command: str,
                    timeout: int = 15) -> tuple[int, str, str]:
        """مثل run ولی exit code واقعی رو هم برمی‌گردونه؛ برای عملیاتی که
        باید بدونیم واقعاً موفق بودن یا نه (نصب/حذف محافظت DNS)."""
        client = self._get_client(server_name, ssh_cfg)
        stdin, stdout, stderr = client.exec_command(command, timeout=timeout)
        out = stdout.read().decode(errors="replace")
        err = stderr.read().decode(errors="replace")
        exit_code = stdout.channel.recv_exit_status()
        return exit_code, out, err

    def run(self, server_name: str, ssh_cfg: dict, command: str, timeout: int = 15) -> str:
        exit_code, out, err = self.run_status(server_name, ssh_cfg, command, timeout=timeout)
        if exit_code != 0 and err.strip():
            # دستورات غیربحرانی (مثل tail لاگ) ممکنه با exit غیرصفر هم خروجی مفید بدن،
            # پس فقط لاگ می‌کنیم، استثنا پرتاب نمی‌کنیم.
            print(f"[{server_name}] command exit={exit_code} stderr={err.strip()[:300]}")
        return out

    def upload_file(self, server_name: str, ssh_cfg: dict, local_path: str, remote_path: str):
        client = self._get_client(server_name, ssh_cfg)
        sftp = client.open_sftp()
        try:
            sftp.put(local_path, remote_path)
        finally:
            sftp.close()

    def close_all(self):
        with self._lock:
            for client in self._clients.values():
                try:
                    client.close()
                except Exception:
                    pass
            self._clients.clear()


ssh_pool = SSHPool()
