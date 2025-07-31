-- Seed Departments
INSERT INTO departments (id, name, city, state) VALUES
    ('d7c6c6a0-0d6c-4a0a-8c6c-6a0d6c4a0a8c', 'Metro Police Department', 'Metropolis', 'NY'),
    ('f8d7d7b1-1e7d-5b1b-9d7d-7b11e7d5b1b9', 'County Sheriff Office', 'Liberty', 'NY');

-- Seed Officers
INSERT INTO officers (id, badge_number, first_name, last_name, department_id, rank, status) VALUES
    ('a1b2c3d4-e5f6-4a1b-2c3d-4e5f6a1b2c3d', 'MPD123', 'John', 'Smith', 'd7c6c6a0-0d6c-4a0a-8c6c-6a0d6c4a0a8c', 'Sergeant', 'active'),
    ('b2c3d4e5-f6a1-5b2c-3d4e-5f6a1b2c3d4e', 'MPD456', 'Jane', 'Doe', 'd7c6c6a0-0d6c-4a0a-8c6c-6a0d6c4a0a8c', 'Officer', 'active'),
    ('c3d4e5f6-a1b2-6c3d-4e5f-6a1b2c3d4e5f', 'CSO789', 'Robert', 'Johnson', 'f8d7d7b1-1e7d-5b1b-9d7d-7b11e7d5b1b9', 'Deputy', 'active');

-- Seed Incidents
INSERT INTO incidents (id, type, description, location, occurred_at) VALUES
    ('d4e5f6a1-b2c3-7d4e-5f6a-1b2c3d4e5f6a', 'use_of_force', 'Excessive force during arrest', ST_SetSRID(ST_MakePoint(-73.935242, 40.730610), 4326), '2024-07-15 10:30:00'),
    ('e5f6a1b2-c3d4-8e5f-6a1b-2c3d4e5f6a1b', 'misconduct', 'Unprofessional behavior', ST_SetSRID(ST_MakePoint(-73.935242, 40.730610), 4326), '2024-07-20 15:45:00');

-- Create a test user (you'll need to create this user in auth.users first)
INSERT INTO auth.users (id, email) VALUES
    ('test-user-id', 'test@example.com')
ON CONFLICT (id) DO NOTHING;

-- Seed Complaints
INSERT INTO complaints (id, incident_id, submitted_by, status, description) VALUES
    ('f6a1b2c3-d4e5-9f6a-1b2c-3d4e5f6a1b2c', 'd4e5f6a1-b2c3-7d4e-5f6a-1b2c3d4e5f6a', 'test-user-id', 'pending', 'Officer used excessive force during a routine traffic stop'),
    ('a1b2c3d4-e5f6-0a1b-2c3d-4e5f6a1b2c3d', 'e5f6a1b2-c3d4-8e5f-6a1b-2c3d4e5f6a1b', 'test-user-id', 'under_review', 'Officer was rude and unprofessional');

-- Link Officers to Incidents
INSERT INTO officer_incidents (officer_id, incident_id, role) VALUES
    ('a1b2c3d4-e5f6-4a1b-2c3d-4e5f6a1b2c3d', 'd4e5f6a1-b2c3-7d4e-5f6a-1b2c3d4e5f6a', 'primary'),
    ('b2c3d4e5-f6a1-5b2c-3d4e-5f6a1b2c3d4e', 'd4e5f6a1-b2c3-7d4e-5f6a-1b2c3d4e5f6a', 'witness'),
    ('c3d4e5f6-a1b2-6c3d-4e5f-6a1b2c3d4e5f', 'e5f6a1b2-c3d4-8e5f-6a1b-2c3d4e5f6a1b', 'primary');