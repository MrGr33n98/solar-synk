from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
import asyncpg
from app.libs.database import get_db_connection

router = APIRouter()

class RegistrationRequest(BaseModel):
    email: EmailStr
    password: str # In a real app, this would be hashed
    role: str # 'installer' or 'supplier'
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
    # In a real app, you would hash the password here
    
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
        INSERT INTO users (id, email, full_name, role_id, company_id)
        VALUES (gen_random_uuid(), $1, $2, $3, $4)
        RETURNING id
        """,
        body.email, body.full_name, role_id, company_id
    )

    return UserResponse(
        id=str(new_user_id),
        email=body.email,
        role=body.role,
        full_name=body.full_name,
        company_name=body.company_name
    )
