from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Company(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    created_at: Optional[datetime] = None

class Product(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    supplier_id: int
    created_at: Optional[datetime] = None

class Review(BaseModel):
    id: int
    product_id: int
    reviewer_name: str
    rating: int
    comment: Optional[str] = None
    created_at: Optional[datetime] = None

class User(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role_id: int
    company_id: Optional[int] = None
    created_at: Optional[datetime] = None

class UserRole(BaseModel):
    id: int
    role_name: str
    description: Optional[str] = None

class Plan(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    billing_cycle: str  # 'monthly' or 'yearly'
    max_products: Optional[int] = None
    max_users: Optional[int] = None
    features: Optional[str] = None  # JSON string of features
    created_at: Optional[datetime] = None

class CompanySubscription(BaseModel):
    id: int
    company_id: int
    plan_id: int
    status: str  # 'active', 'inactive', 'cancelled'
    start_date: datetime
    end_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class Lead(BaseModel):
    id: int
    installer_id: str  # User ID of the installer
    supplier_id: int   # Company ID of the supplier
    project_description: str
    project_type: Optional[str] = None
    estimated_budget: Optional[float] = None
    location: Optional[str] = None
    contact_email: str
    contact_phone: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    timeline: Optional[str] = None
    status: str = 'pending'  # 'pending', 'contacted', 'quoted', 'closed'
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
