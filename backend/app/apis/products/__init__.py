from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
import asyncpg
from app.libs.database import get_db_connection
from app.libs.models import Product

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[Product])
async def list_products(
    category: str = Query(None, description="Filter by category name"),
    brand: str = Query(None, description="Filter by brand name"),
    db: asyncpg.Connection = Depends(get_db_connection)
):
    query = "SELECT p.* FROM products p"
    conditions = []
    params = []

    if category:
        conditions.append("p.category_id = (SELECT id FROM product_categories WHERE name = $1)")
        params.append(category)
    
    if brand:
        # If a category is also specified, the brand parameter will be $2, otherwise $1
        param_index = len(params) + 1
        conditions.append(f"p.brand ILIKE ${param_index}")
        params.append(f"%{brand}%")

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    try:
        products = await db.fetch(query, *params)
        return [Product(**dict(p)) for p in products]
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: int,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    query = "SELECT * FROM products WHERE id = $1"
    product = await db.fetchrow(query, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**dict(product))
