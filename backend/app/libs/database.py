import os
import asyncpg
from typing import AsyncGenerator

pool: asyncpg.Pool | None = None

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/solarsync")


async def init_db_pool() -> None:
    """Initialize the asyncpg connection pool."""
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(DATABASE_URL)


async def close_db_pool() -> None:
    """Close the asyncpg connection pool."""
    global pool
    if pool is not None:
        await pool.close()
        pool = None

async def get_db_connection() -> AsyncGenerator[asyncpg.Connection, None]:
    """Acquire a connection from the pool for dependency injection."""
    if pool is None:
        await init_db_pool()
    assert pool is not None
    conn = await pool.acquire()
    try:
        yield conn
    finally:
        await pool.release(conn)
