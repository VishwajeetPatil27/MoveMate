-- MoveMate Migration V2: User, Profile, and Location Foundation
-- Enforces UTF-8 collation and InnoDB relational safety

-- Seed Baseline Locations if empty
INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Maharashtra', 'Sangli', 'City Center'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Sangli' AND state = 'Maharashtra');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Maharashtra', 'Pune', 'Kothrud'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Pune' AND state = 'Maharashtra');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Karnataka', 'Bangalore', 'Whitefield'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Bangalore' AND state = 'Karnataka');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Maharashtra', 'Mumbai', 'Andheri'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Mumbai' AND state = 'Maharashtra');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Telangana', 'Hyderabad', 'HITEC City'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Hyderabad' AND state = 'Telangana');
