import os
import asyncpg
from typing import AsyncGenerator

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/solarsync")

async def get_db_connection() -> AsyncGenerator[asyncpg.Connection, None]:
    """Get database connection for dependency injection."""
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        await conn.close()
