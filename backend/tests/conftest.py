import pytest
import uuid
from fastapi.testclient import TestClient
from backend.main import create_app
from app.libs import database
from databutton_app.mw import auth_mw


class FakeDB:
    def __init__(self):
        self.user_roles = {1: "installer", 2: "supplier"}
        self.users = {}
        self.companies = {}
        self.next_company_id = 1

    async def fetchval(self, query, *args):
        if "SELECT id FROM users WHERE email" in query:
            email = args[0]
            for uid, u in self.users.items():
                if u["email"] == email:
                    return uid
            return None
        if "SELECT id FROM user_roles WHERE role_name" in query:
            role_name = args[0]
            for rid, name in self.user_roles.items():
                if name == role_name:
                    return rid
            return None
        if "INSERT INTO companies" in query:
            name = args[0]
            cid = self.next_company_id
            self.next_company_id += 1
            self.companies[cid] = {"id": cid, "name": name}
            return cid
        if "INSERT INTO users" in query:
            email, full_name, role_id, company_id, password_hash = args
            uid = str(uuid.uuid4())
            self.users[uid] = {
                "id": uid,
                "email": email,
                "full_name": full_name,
                "role_id": role_id,
                "company_id": company_id,
                "password_hash": password_hash,
            }
            return uid
        if "SELECT role_name FROM user_roles WHERE id" in query:
            rid = args[0]
            return self.user_roles.get(rid)
        raise NotImplementedError(query)

    async def fetchrow(self, query, *args):
        if "SELECT id, email, full_name, role_id, company_id, password_hash FROM users WHERE email" in query:
            email = args[0]
            for u in self.users.values():
                if u["email"] == email:
                    return u
            return None
        raise NotImplementedError(query)


@pytest.fixture
def fake_db():
    return FakeDB()


@pytest.fixture
def app(fake_db, monkeypatch):
    async def override_get_db_connection():
        yield fake_db

    monkeypatch.setattr(database, "get_db_connection", override_get_db_connection)

    def dummy_get_authorized_user(request):
        return auth_mw.User(sub="test-user")

    monkeypatch.setattr(auth_mw, "get_authorized_user", dummy_get_authorized_user)

    return create_app()


@pytest.fixture
def client(app):
    with TestClient(app) as tc:
        yield tc
