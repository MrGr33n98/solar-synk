import pytest


@pytest.mark.asyncio
async def test_register_and_login(client):
    register_payload = {
        "email": "user@example.com",
        "password": "secret",
        "role": "installer",
        "full_name": "Test User",
        "company_name": None,
    }

    resp = await client.post("/routes/users/register", json=register_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "user@example.com"
    assert data["role"] == "installer"

    login_payload = {"email": "user@example.com", "password": "secret"}
    resp = await client.post("/routes/users/login", json=login_payload)
    assert resp.status_code == 200
    login = resp.json()
    assert login["email"] == "user@example.com"
    assert login["id"] == data["id"]


@pytest.mark.asyncio
async def test_login_invalid_password(client):
    payload = {
        "email": "another@example.com",
        "password": "topsecret",
        "role": "installer",
        "full_name": "Another User",
        "company_name": None,
    }
    await client.post("/routes/users/register", json=payload)

    bad_login = {"email": "another@example.com", "password": "wrong"}
    resp = await client.post("/routes/users/login", json=bad_login)
    assert resp.status_code == 401
