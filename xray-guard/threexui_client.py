"""
کلاینت API پنل 3x-ui.

نکته مهم: مسیرهای API بین نسخه‌ها/فورک‌های مختلف 3x-ui ممکنه کمی فرق کنه.
مسیرهای زیر رایج‌ترین نسخه‌ی عمومی 3x-ui هستن؛ قبل از استفاده‌ی واقعی، با
مستندات/Swagger همون نسخه‌ای که نصب کردی تطبیقش بده (در README توضیح داده شده).
"""
from __future__ import annotations

import json
import requests


class ThreeXUIError(RuntimeError):
    pass


class ThreeXUIClient:
    def __init__(self, base_url: str, web_base_path: str, username: str,
                 password: str, verify_ssl: bool = False):
        self.base_url = base_url.rstrip("/")
        self.base_path = "/" + web_base_path.strip("/") if web_base_path.strip("/") else ""
        self.username = username
        self.password = password
        self.verify_ssl = verify_ssl
        self.session = requests.Session()
        self.session.verify = verify_ssl
        self._logged_in = False
        if not verify_ssl:
            import urllib3
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

    def _url(self, path: str) -> str:
        return f"{self.base_url}{self.base_path}{path}"

    def login(self):
        resp = self.session.post(
            self._url("/login"),
            data={"username": self.username, "password": self.password},
            timeout=10,
        )
        resp.raise_for_status()
        body = resp.json()
        if not body.get("success", False):
            raise ThreeXUIError(f"ورود به پنل ناموفق: {body}")
        self._logged_in = True

    def _ensure_login(self):
        if not self._logged_in:
            self.login()

    def _get(self, path: str) -> dict:
        self._ensure_login()
        resp = self.session.get(self._url(path), timeout=10)
        if resp.status_code == 401:
            self._logged_in = False
            self._ensure_login()
            resp = self.session.get(self._url(path), timeout=10)
        resp.raise_for_status()
        return resp.json()

    def _post(self, path: str, data: dict) -> dict:
        self._ensure_login()
        resp = self.session.post(self._url(path), data=data, timeout=10)
        if resp.status_code == 401:
            self._logged_in = False
            self._ensure_login()
            resp = self.session.post(self._url(path), data=data, timeout=10)
        resp.raise_for_status()
        return resp.json()

    def list_inbounds(self) -> list[dict]:
        body = self._get("/panel/api/inbounds/list")
        return body.get("obj", []) or []

    def get_client_traffic(self, email: str) -> dict | None:
        body = self._get(f"/panel/api/inbounds/getClientTraffics/{email}")
        return body.get("obj")

    def find_client(self, email: str) -> tuple[int, dict] | None:
        """تو همه‌ی inbound ها دنبال کلاینتی با این ایمیل می‌گرده."""
        for inbound in self.list_inbounds():
            try:
                settings = json.loads(inbound.get("settings", "{}"))
            except (TypeError, json.JSONDecodeError):
                continue
            for client in settings.get("clients", []):
                if client.get("email") == email:
                    return inbound["id"], client
        return None

    def set_client_enabled(self, inbound_id: int, client: dict, enabled: bool):
        """کلاینت رو فعال/غیرفعال می‌کنه (قفل = enabled=False)."""
        updated = dict(client)
        updated["enable"] = enabled
        client_identifier = updated.get("id") or updated.get("password")
        payload = {
            "id": inbound_id,
            "settings": json.dumps({"clients": [updated]}),
        }
        self._post(f"/panel/api/inbounds/updateClient/{client_identifier}", payload)

    def list_online_emails(self) -> list[str]:
        body = self._post("/panel/api/inbounds/onlines", data={})
        return body.get("obj", []) or []
