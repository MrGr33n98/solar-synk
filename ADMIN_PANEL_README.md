# Admin Panel Implementation - Task 1

## Overview
This implementation fulfills **Task 1**: Developing an Administrator Panel for managing subscription plans.

## Features Implemented

### Backend Components

1. **Database Models** (`app/libs/models.py`)
   - `Plan`: Subscription plan model with pricing and features
   - `CompanySubscription`: Links companies to their active plans
   - Extended existing models with subscription relationships

2. **Admin API Endpoints** (`app/apis/admin/__init__.py`)
   - `GET /routes/admin/companies` - List all companies with subscription status
   - `GET /routes/admin/plans` - List all available plans
   - `POST /routes/admin/plans` - Create new subscription plans
   - `PUT /routes/admin/subscriptions` - Update company subscription plans
   - `GET /routes/admin/subscriptions/{company_id}` - Get subscription history
   - `DELETE /routes/admin/subscriptions/{company_id}` - Cancel subscriptions

3. **Database Migration** (`migrations/001_admin_panel.sql`)
   - Creates `plans` table with Basic, Premium, and Enterprise tiers
   - Creates `company_subscriptions` table to track company plan assignments
   - Adds admin role to user_roles table
   - Includes proper indexes and constraints

4. **Authentication & Authorization**
   - Admin role verification for all admin endpoints
   - JWT token-based authentication using existing auth middleware

### Frontend Components

1. **Admin Panel Page** (`pages/AdminPanelSimple.tsx`)
   - Companies listing with current subscription status
   - Plans overview with pricing information
   - Clean, responsive interface
   - Error handling and loading states

2. **Routing Integration**
   - Added `/admin` route to user routes
   - Protected route requiring authentication

## Database Schema

### Plans Table
```sql
CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    max_products INTEGER,
    max_users INTEGER,
    features TEXT, -- JSON string of features
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Company Subscriptions Table
```sql
CREATE TABLE company_subscriptions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Default Plans Created

1. **Básico** - R$ 29,90/month
   - Up to 10 products
   - 2 users
   - Basic features

2. **Premium** - R$ 79,90/month
   - Up to 50 products
   - 10 users
   - Advanced analytics and lead management

3. **Empresa** - R$ 199,90/month
   - Unlimited products and users
   - Enterprise features and API access

## Setup Instructions

1. **Run Database Migration**
   ```bash
   psql -d your_database -f backend/migrations/001_admin_panel.sql
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Create Admin User**
   - Register a user through the existing registration flow
   - Manually update the user's role to 'admin' in the database:
   ```sql
   UPDATE users SET role_id = (SELECT id FROM user_roles WHERE role_name = 'admin') 
   WHERE email = 'admin@example.com';
   ```

4. **Access Admin Panel**
   - Navigate to `/admin` after logging in as an admin user
   - The panel will show all companies and their subscription statuses

## API Usage Examples

### Get All Companies with Subscriptions
```bash
curl -H "Authorization: Bearer {token}" GET /routes/admin/companies
```

### Update Company Subscription
```bash
curl -H "Authorization: Bearer {token}" -H "Content-Type: application/json" \
  -X PUT /routes/admin/subscriptions \
  -d '{"company_id": 1, "plan_id": 2}'
```

### Create New Plan
```bash
curl -H "Authorization: Bearer {token}" -H "Content-Type: application/json" \
  -X POST /routes/admin/plans \
  -d '{
    "name": "Custom Plan",
    "description": "Custom enterprise plan",
    "price": 299.90,
    "billing_cycle": "monthly",
    "max_products": -1,
    "max_users": -1
  }'
```

## Security Features

- **Role-based Access Control**: Only users with 'admin' role can access endpoints
- **JWT Authentication**: All requests require valid authentication tokens
- **Database Constraints**: Proper foreign key constraints and data validation
- **Input Validation**: Pydantic models validate all input data

## Meeting Acceptance Criteria

✅ **New Administrator Panel Page**: Created `/admin` route with dedicated interface
✅ **Admin-only Access**: Role-based authentication ensures only admins can access
✅ **Companies Listing**: Panel displays all registered companies with subscription status
✅ **Plan Management**: Admins can view and change company subscription plans
✅ **Database Updates**: Added `plans` and `company_subscriptions` tables with proper relationships

The implementation provides a solid foundation for subscription management and can be extended with additional features like billing integration, detailed analytics, and automated plan management.
