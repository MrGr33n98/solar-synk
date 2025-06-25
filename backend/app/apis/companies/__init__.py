from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List
import asyncpg
from app.libs.database import get_db_connection
from app.libs.models import Company, Product
from pydantic import BaseModel

class CompanyProfile(Company):
    products: List[Product] = []

router = APIRouter(prefix="/companies", tags=["companies"])

@router.get("/", response_model=List[Company])
async def search_companies(
    state: str = Query(None, description="Filter by state (e.g., 'SP')"),
    city: str = Query(None, description="Filter by city"),
    db: asyncpg.Connection = Depends(get_db_connection)
):
    query = "SELECT * FROM companies"
    conditions = []
    params = []
    
    if state:
        params.append(state.upper())
        conditions.append(f"state = ${len(params)}")
        
    if city:
        params.append(city)
        conditions.append(f"city ILIKE ${len(params)}")

    if conditions:
        query += " WHERE " + " AND ".join(conditions)
        
    query += " ORDER BY name"

    try:
        companies = await db.fetch(query, *params)
        return [Company(**dict(c)) for c in companies]
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/{company_id}", response_model=CompanyProfile)
async def get_company_profile(
    company_id: int,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    # Fetch company details
    company_query = "SELECT * FROM companies WHERE id = $1"
    company_record = await db.fetchrow(company_query, company_id)
    if not company_record:
        raise HTTPException(status_code=404, detail="Company not found")

    # Record the profile view in the background
    try:
        view_query = "INSERT INTO profile_views (company_id) VALUES ($1)"
        await db.execute(view_query, company_id)
    except asyncpg.exceptions.PostgresError as e:
        # Log the error, but don't prevent the profile from loading
        print(f"Error recording profile view for company {company_id}: {e}")

    # Fetch products for the company
    products_query = "SELECT * FROM products WHERE supplier_id = $1 ORDER BY name"
    product_records = await db.fetch(products_query, company_id)

    company_data = dict(company_record)
    company_data['products'] = [Product(**dict(p)) for p in product_records]

    return CompanyProfile(**company_data)
