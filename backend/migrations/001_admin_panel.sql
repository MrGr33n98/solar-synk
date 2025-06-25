-- Migration script to create plans and company_subscriptions tables for admin panel
-- Run this script against your database

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
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

-- Create company_subscriptions table
CREATE TABLE IF NOT EXISTS company_subscriptions (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
    start_date TIMESTAMP NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_company_id ON company_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_plan_id ON company_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_status ON company_subscriptions(status);

-- Add admin role if it doesn't exist
INSERT INTO user_roles (role_name, description) 
VALUES ('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO NOTHING;

-- Insert default plans
INSERT INTO plans (name, description, price, billing_cycle, max_products, max_users, features) VALUES
('Básico', 'Plano básico para pequenas empresas', 29.90, 'monthly', 10, 2, '{"listings": true, "basic_analytics": true, "email_support": true}'),
('Premium', 'Plano premium com recursos avançados', 79.90, 'monthly', 50, 10, '{"listings": true, "advanced_analytics": true, "priority_support": true, "lead_management": true, "custom_branding": true}'),
('Empresa', 'Plano corporativo para grandes empresas', 199.90, 'monthly', -1, -1, '{"unlimited_listings": true, "enterprise_analytics": true, "dedicated_support": true, "api_access": true, "white_label": true}')
ON CONFLICT (name) DO NOTHING;

-- Update trigger for company_subscriptions
CREATE OR REPLACE FUNCTION update_company_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_subscriptions_updated_at
    BEFORE UPDATE ON company_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_company_subscriptions_updated_at();
