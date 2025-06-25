from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
from app.libs.database import get_db_connection
from app.libs.models import Company, Plan, CompanySubscription
from app.auth import AuthorizedUser
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["admin"])

class CompanyWithSubscription(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    current_plan: Optional[str] = None
    plan_status: Optional[str] = None
    subscription_start: Optional[datetime] = None
    subscription_end: Optional[datetime] = None

class UpdateSubscriptionRequest(BaseModel):
    company_id: int
    plan_id: int

class CreatePlanRequest(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    billing_cycle: str
    max_products: Optional[int] = None
    max_users: Optional[int] = None
    features: Optional[str] = None

async def verify_admin_role(user: AuthorizedUser, db: asyncpg.Connection):
    """Verify that the user has admin role."""
    user_role = await db.fetchval(
        """
        SELECT ur.role_name 
        FROM users u 
        JOIN user_roles ur ON u.role_id = ur.id 
        WHERE u.id = $1
        """, 
        user.sub
    )
    
    if user_role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")

@router.get("/companies", response_model=List[CompanyWithSubscription])
async def list_companies_with_subscriptions(
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all companies with their subscription information."""
    await verify_admin_role(user, db)
    
    offset = (page - 1) * limit
    
    query = """
        SELECT 
            c.id, c.name, c.description, c.address, c.city, c.state, 
            c.phone, c.email, c.website,
            p.name as current_plan,
            cs.status as plan_status,
            cs.start_date as subscription_start,
            cs.end_date as subscription_end
        FROM companies c
        LEFT JOIN company_subscriptions cs ON c.id = cs.company_id AND cs.status = 'active'
        LEFT JOIN plans p ON cs.plan_id = p.id
        ORDER BY c.name
        LIMIT $1 OFFSET $2
    """
    
    try:
        companies = await db.fetch(query, limit, offset)
        return [CompanyWithSubscription(**dict(company)) for company in companies]
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/plans", response_model=List[Plan])
async def list_plans(
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Get all available subscription plans."""
    await verify_admin_role(user, db)
    
    query = "SELECT * FROM plans ORDER BY price"
    
    try:
        plans = await db.fetch(query)
        return [Plan(**dict(plan)) for plan in plans]
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.post("/plans", response_model=Plan)
async def create_plan(
    body: CreatePlanRequest,
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Create a new subscription plan."""
    await verify_admin_role(user, db)
    
    if body.billing_cycle not in ['monthly', 'yearly']:
        raise HTTPException(status_code=400, detail="Billing cycle must be 'monthly' or 'yearly'")
    
    query = """
        INSERT INTO plans (name, description, price, billing_cycle, max_products, max_users, features)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    """
    
    try:
        plan_record = await db.fetchrow(
            query, 
            body.name, body.description, body.price, body.billing_cycle,
            body.max_products, body.max_users, body.features
        )
        return Plan(**dict(plan_record))
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Plan with this name already exists")
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.put("/subscriptions", response_model=dict)
async def update_company_subscription(
    body: UpdateSubscriptionRequest,
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Update a company's subscription plan."""
    await verify_admin_role(user, db)
    
    # Verify company exists
    company = await db.fetchrow("SELECT id FROM companies WHERE id = $1", body.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Verify plan exists
    plan = await db.fetchrow("SELECT id FROM plans WHERE id = $1", body.plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    try:
        async with db.transaction():
            # Deactivate current subscription if exists
            await db.execute(
                "UPDATE company_subscriptions SET status = 'inactive', updated_at = NOW() WHERE company_id = $1 AND status = 'active'",
                body.company_id
            )
            
            # Create new subscription
            await db.execute(
                """
                INSERT INTO company_subscriptions (company_id, plan_id, status, start_date)
                VALUES ($1, $2, 'active', NOW())
                """,
                body.company_id, body.plan_id
            )
        
        return {"message": "Subscription updated successfully"}
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/subscriptions/{company_id}", response_model=List[CompanySubscription])
async def get_company_subscription_history(
    company_id: int,
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Get subscription history for a specific company."""
    await verify_admin_role(user, db)
    
    query = """
        SELECT * FROM company_subscriptions 
        WHERE company_id = $1 
        ORDER BY created_at DESC
    """
    
    try:
        subscriptions = await db.fetch(query, company_id)
        return [CompanySubscription(**dict(sub)) for sub in subscriptions]
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.delete("/subscriptions/{company_id}")
async def cancel_company_subscription(
    company_id: int,
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Cancel a company's active subscription."""
    await verify_admin_role(user, db)
    
    try:
        result = await db.execute(
            "UPDATE company_subscriptions SET status = 'cancelled', updated_at = NOW() WHERE company_id = $1 AND status = 'active'",
            company_id
        )
        
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="No active subscription found for this company")
        
        return {"message": "Subscription cancelled successfully"}
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
