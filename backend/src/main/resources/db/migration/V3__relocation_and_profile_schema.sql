-- MoveMate Migration V3: Relocation Requests & Enhanced Location Intelligence
-- Adds relocation_requests table and expands location seeds

CREATE TABLE IF NOT EXISTS relocation_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    origin_location_id BIGINT NOT NULL,
    destination_location_id BIGINT NOT NULL,
    destination_area VARCHAR(100) NULL,
    purpose VARCHAR(50) NULL,
    profession VARCHAR(100) NULL,
    budget DECIMAL(10,2) NULL,
    moving_date DATE NULL,
    requirements TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rr_origin FOREIGN KEY (origin_location_id) REFERENCES locations(id),
    CONSTRAINT fk_rr_dest FOREIGN KEY (destination_location_id) REFERENCES locations(id),
    INDEX idx_rr_user (user_id),
    INDEX idx_rr_route (origin_location_id, destination_location_id),
    INDEX idx_rr_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Additional Seed Locations
INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Delhi', 'Delhi', 'Connaught Place'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Delhi' AND state = 'Delhi');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Haryana', 'Gurgaon', 'Cyber City'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Gurgaon' AND state = 'Haryana');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Uttar Pradesh', 'Noida', 'Sector 62'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Noida' AND state = 'Uttar Pradesh');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Tamil Nadu', 'Chennai', 'OMR Road'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Chennai' AND state = 'Tamil Nadu');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Gujarat', 'Ahmedabad', 'SG Highway'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Ahmedabad' AND state = 'Gujarat');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'West Bengal', 'Kolkata', 'Salt Lake'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Kolkata' AND state = 'West Bengal');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Maharashtra', 'Pune', 'Hinjawadi'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Pune' AND area = 'Hinjawadi');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Karnataka', 'Bangalore', 'Koramangala'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Bangalore' AND area = 'Koramangala');

INSERT INTO locations (country, state, city, area)
SELECT 'India', 'Maharashtra', 'Mumbai', 'Bandra'
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE city = 'Mumbai' AND area = 'Bandra');
