-- Migration script to create leads table for Task 2 - Lead Generation Funnel
-- Run this script against your database

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    installer_id VARCHAR(255) NOT NULL, -- User ID from auth system
    supplier_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    project_description TEXT NOT NULL,
    project_type VARCHAR(50),
    estimated_budget DECIMAL(12,2),
    location VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    preferred_contact_method VARCHAR(20) DEFAULT 'email',
    timeline VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'closed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_installer_id ON leads(installer_id);
CREATE INDEX IF NOT EXISTS idx_leads_supplier_id ON leads(supplier_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Update trigger for leads
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_leads_updated_at();

-- Add installer role if it doesn't exist
INSERT INTO user_roles (role_name, description) 
VALUES ('installer', 'Solar panel installer who can request quotes from suppliers')
ON CONFLICT (role_name) DO NOTHING;

-- Create table for tracking profile views (if not exists)
CREATE TABLE IF NOT EXISTS profile_views (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_views_company_id ON profile_views(company_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);
