from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
import asyncpg
from app.libs.database import get_db_connection
from app.libs.models import Review
from app.auth import AuthorizedUser
from uuid import UUID

router = APIRouter(prefix="/reviews", tags=["reviews"])

class ReviewRequest(BaseModel):
    product_id: int
    rating: int
    comment: str

@router.get("/{product_id}", response_model=List[Review])
async def list_reviews_for_product(
    product_id: int,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    query = "SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC"
    reviews = await db.fetch(query, product_id)
    return [Review(**dict(r)) for r in reviews]

@router.post("/", response_model=Review)
async def submit_review(
    body: ReviewRequest,
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    user_id: UUID = user.sub

    # Check if the user has already reviewed this product
    existing_review = await db.fetchval(
        "SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2",
        body.product_id, user_id
    )
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")

    query = """
        INSERT INTO reviews (product_id, user_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING id, product_id, user_id, rating, comment, created_at
    """
    new_review = await db.fetchrow(
        query, body.product_id, user_id, body.rating, body.comment
    )
    
    if not new_review:
        raise HTTPException(status_code=500, detail="Failed to create review")

    return Review(**dict(new_review))
