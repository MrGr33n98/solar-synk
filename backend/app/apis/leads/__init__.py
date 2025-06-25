from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import asyncpg
from app.libs.database import get_db_connection
from app.libs.models import Lead
from app.auth import AuthorizedUser
from datetime import datetime

router = APIRouter(prefix="/leads", tags=["leads"])

class CreateLeadRequest(BaseModel):
    supplier_id: int
    project_description: str
    project_type: Optional[str] = None
    estimated_budget: Optional[float] = None
    location: Optional[str] = None
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    preferred_contact_method: Optional[str] = 'email'
    timeline: Optional[str] = None

class UpdateLeadStatusRequest(BaseModel):
    lead_id: int
    status: str
    notes: Optional[str] = None

class LeadWithSupplierInfo(BaseModel):
    id: int
    installer_id: str
    supplier_id: int
    supplier_name: str
    project_description: str
    project_type: Optional[str] = None
    estimated_budget: Optional[float] = None
    location: Optional[str] = None
    contact_email: str
    contact_phone: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    timeline: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

@router.post("/", response_model=Lead)
async def create_lead(
    body: CreateLeadRequest,
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Create a new lead (quote request) from installer to supplier."""
    
    # Verify that the user is an installer
    user_role = await db.fetchval(
        "SELECT ur.role_name FROM users u JOIN user_roles ur ON u.role_id = ur.id WHERE u.id = $1",
        user.sub
    )
    
    if user_role != 'installer':
        raise HTTPException(status_code=403, detail="Only installers can create leads")
    
    # Verify supplier exists
    supplier = await db.fetchrow("SELECT id, name FROM companies WHERE id = $1", body.supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    # Create the lead
    query = """
        INSERT INTO leads (
            installer_id, supplier_id, project_description, project_type, 
            estimated_budget, location, contact_email, contact_phone, 
            preferred_contact_method, timeline, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
        RETURNING *
    """
    
    try:
        lead_record = await db.fetchrow(
            query,
            user.sub, body.supplier_id, body.project_description, body.project_type,
            body.estimated_budget, body.location, body.contact_email, body.contact_phone,
            body.preferred_contact_method, body.timeline
        )
        
        # TODO: Send email notification to supplier
        # await send_lead_notification_email(supplier['name'], body.contact_email, body.project_description)
        
        return Lead(**dict(lead_record))
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/my-leads", response_model=List[LeadWithSupplierInfo])
async def get_my_leads(
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Get all leads created by the current installer."""
    
    query = """
        SELECT 
            l.*,
            c.name as supplier_name
        FROM leads l
        JOIN companies c ON l.supplier_id = c.id
        WHERE l.installer_id = $1
        ORDER BY l.created_at DESC
    """
    
    try:
        leads = await db.fetch(query, user.sub)
        return [LeadWithSupplierInfo(**dict(lead)) for lead in leads]
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/received", response_model=List[Lead])
async def get_received_leads(
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Get all leads received by the current supplier."""
    
    # Get the supplier's company ID
    company_id = await db.fetchval(
        "SELECT company_id FROM users WHERE id = $1",
        user.sub
    )
    
    if not company_id:
        raise HTTPException(status_code=403, detail="User is not associated with a company")
    
    query = """
        SELECT l.* FROM leads l
        WHERE l.supplier_id = $1
        ORDER BY l.created_at DESC
    """
    
    try:
        leads = await db.fetch(query, company_id)
        return [Lead(**dict(lead)) for lead in leads]
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.put("/status", response_model=dict)
async def update_lead_status(
    body: UpdateLeadStatusRequest,
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Update the status of a lead (suppliers only)."""
    
    # Get the supplier's company ID
    company_id = await db.fetchval(
        "SELECT company_id FROM users WHERE id = $1",
        user.sub
    )
    
    if not company_id:
        raise HTTPException(status_code=403, detail="User is not associated with a company")
    
    # Verify the lead belongs to this supplier
    lead = await db.fetchrow(
        "SELECT id FROM leads WHERE id = $1 AND supplier_id = $2",
        body.lead_id, company_id
    )
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found or not authorized")
    
    # Valid status values
    valid_statuses = ['pending', 'contacted', 'quoted', 'closed']
    if body.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    try:
        await db.execute(
            "UPDATE leads SET status = $1, notes = $2, updated_at = NOW() WHERE id = $3",
            body.status, body.notes, body.lead_id
        )
        
        return {"message": "Lead status updated successfully"}
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/{lead_id}", response_model=Lead)
async def get_lead_details(
    lead_id: int,
    user: AuthorizedUser,
    db: asyncpg.Connection = Depends(get_db_connection)
):
    """Get details of a specific lead."""
    
    # Check if user is the installer who created the lead or the supplier who received it
    company_id = await db.fetchval("SELECT company_id FROM users WHERE id = $1", user.sub)
    
    query = """
        SELECT * FROM leads 
        WHERE id = $1 AND (installer_id = $2 OR supplier_id = $3)
    """
    
    lead = await db.fetchrow(query, lead_id, user.sub, company_id)
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found or not authorized")
    
    return Lead(**dict(lead))
