from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
import asyncpg
from app.libs.database import get_db_connection
from app.libs.models import Lead
from app.auth import AuthorizedUser
from datetime import datetime, timedelta

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

class AnalyticsData(BaseModel):
    total_views: int
    views_past_30_days: int
    daily_views: List[dict]
    total_leads: int
    pending_leads: int
    recent_leads: List[Lead]

@router.get("/analytics", response_model=AnalyticsData)
async def get_analytics(
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    # First, get the company_id for the logged-in supplier
    user_id = user.sub
    company_id_record = await db.fetchrow("SELECT company_id FROM users WHERE id = $1", user_id)
    if not company_id_record or not company_id_record['company_id']:
        raise HTTPException(status_code=403, detail="User is not associated with a company.")
    
    company_id = company_id_record['company_id']

    # Get total views
    total_views_record = await db.fetchrow("SELECT COUNT(*) FROM profile_views WHERE company_id = $1", company_id)
    total_views = total_views_record['count'] if total_views_record else 0

    # Get views in the past 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    views_past_30_days_record = await db.fetchrow(
        "SELECT COUNT(*) FROM profile_views WHERE company_id = $1 AND viewed_at >= $2",
        company_id, thirty_days_ago
    )
    views_past_30_days = views_past_30_days_record['count'] if views_past_30_days_record else 0

    # Get daily view counts for the last 30 days
    daily_views_query = """
    SELECT
        DATE_TRUNC('day', viewed_at)::date AS view_day,
        COUNT(*) AS view_count
    FROM
        profile_views
    WHERE
        company_id = $1 AND viewed_at >= $2
    GROUP BY
        view_day
    ORDER BY
        view_day;
    """
    daily_views_records = await db.fetch(daily_views_query, company_id, thirty_days_ago)
    
    # Format for chart
    daily_views = [{"date": record['view_day'].strftime('%Y-%m-%d'), "views": record['view_count']} for record in daily_views_records]

    # Get lead statistics
    total_leads_record = await db.fetchrow("SELECT COUNT(*) FROM leads WHERE supplier_id = $1", company_id)
    total_leads = total_leads_record['count'] if total_leads_record else 0
    
    pending_leads_record = await db.fetchrow("SELECT COUNT(*) FROM leads WHERE supplier_id = $1 AND status = 'pending'", company_id)
    pending_leads = pending_leads_record['count'] if pending_leads_record else 0
    
    # Get recent leads (last 5)
    recent_leads_query = """
        SELECT * FROM leads 
        WHERE supplier_id = $1 
        ORDER BY created_at DESC 
        LIMIT 5
    """
    recent_leads_records = await db.fetch(recent_leads_query, company_id)
    recent_leads = [Lead(**dict(record)) for record in recent_leads_records]

    return AnalyticsData(
        total_views=total_views,
        views_past_30_days=views_past_30_days,
        daily_views=daily_views,
        total_leads=total_leads,
        pending_leads=pending_leads,
        recent_leads=recent_leads
    )
