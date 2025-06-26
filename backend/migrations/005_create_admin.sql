-- Insert admin role if not exists
INSERT INTO user_roles (role_name, description)
VALUES ('admin', 'System Administrator')
ON CONFLICT (role_name) DO NOTHING;

-- Create admin user
INSERT INTO users (email, password_hash, full_name, role_id)
SELECT 
    'admin@solarsync.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewF3LQFSUHaLbeEK', -- Default password: 'admin123'
    'System Administrator',
    id
FROM user_roles 
WHERE role_name = 'admin'
ON CONFLICT (email) DO NOTHING;