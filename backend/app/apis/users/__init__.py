from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
import asyncpg
from passlib.context import CryptContext
from app.libs.database import get_db_connection

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """Verify a plaintext password against a hash."""
    return pwd_context.verify(password, hashed)

class RegistrationRequest(BaseModel):
    email: EmailStr
    password: str
    role: str  # 'installer' or 'supplier'
    full_name: str
    company_name: str | None = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: str
    full_name: str
    company_name: str | None = None

@router.post("/register", response_model=UserResponse)
async def register_user(body: RegistrationRequest, db: asyncpg.Connection = Depends(get_db_connection)):
    password_hash = hash_password(body.password)
    
    # Check if user already exists
    user_exists = await db.fetchval("SELECT id FROM users WHERE email = $1", body.email)
    if user_exists:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Get role_id
    role_id = await db.fetchval("SELECT id FROM user_roles WHERE role_name = $1", body.role)
    if not role_id:
        raise HTTPException(status_code=400, detail="Invalid role specified")

    company_id = None
    if body.role == 'supplier':
        if not body.company_name:
            raise HTTPException(status_code=400, detail="Company name is required for suppliers")
        # Create a new company
        company_id = await db.fetchval(
            "INSERT INTO companies (name) VALUES ($1) RETURNING id",
            body.company_name
        )

    # Create user
    new_user_id = await db.fetchval(
        """
        INSERT INTO users (id, email, full_name, role_id, company_id, password_hash)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
        RETURNING id
        """,
        body.email, body.full_name, role_id, company_id, password_hash
    )

    return UserResponse(
        id=str(new_user_id),
        email=body.email,
        role=body.role,
        full_name=body.full_name,
        company_name=body.company_name
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/login", response_model=UserResponse)
async def login_user(body: LoginRequest, db: asyncpg.Connection = Depends(get_db_connection)):
    user_record = await db.fetchrow(
        "SELECT id, email, full_name, role_id, company_id, password_hash FROM users WHERE email = $1",
        body.email,
    )
    if not user_record or not verify_password(body.password, user_record["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    role_name = await db.fetchval("SELECT role_name FROM user_roles WHERE id = $1", user_record["role_id"])

    return UserResponse(
        id=str(user_record["id"]),
        email=user_record["email"],
        role=role_name,
        full_name=user_record["full_name"],
        company_name=user_record["company_id"],
    )
