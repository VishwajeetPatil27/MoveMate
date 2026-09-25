-- Phase 7 Migration: Accommodation, Room Discovery & Housing Infrastructure
-- Creates accommodations, accommodation_images, and accommodation_favorites tables with indexes and initial seeds

CREATE TABLE IF NOT EXISTS accommodations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'ROOM',
    rent DECIMAL(10,2) NOT NULL,
    deposit DECIMAL(10,2) NULL,
    location_id BIGINT NOT NULL,
    available_from DATE NULL,
    gender_preference VARCHAR(50) DEFAULT 'ANY',
    furnished VARCHAR(50) DEFAULT 'SEMI_FURNISHED',
    facilities TEXT NULL,
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_acc_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_acc_location FOREIGN KEY (location_id) REFERENCES locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS accommodation_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    accommodation_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ai_accommodation FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS accommodation_favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    accommodation_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_af_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_af_accommodation FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE,
    CONSTRAINT uk_acc_favorite UNIQUE (user_id, accommodation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for high performance search queries
CREATE INDEX idx_acc_search ON accommodations(location_id, rent, type, status);
CREATE INDEX idx_acc_owner ON accommodations(owner_id);
CREATE INDEX idx_af_user ON accommodation_favorites(user_id);

-- Initial seed listings in Pune and Bangalore for default user (id 1)
INSERT INTO accommodations (id, owner_id, title, description, type, rent, deposit, location_id, available_from, gender_preference, furnished, facilities, status, created_at, updated_at)
SELECT 1, 1, 'Spacious 1BHK Flat near Hinjawadi Phase 1 Tech Park', 'Fully furnished 1BHK flat with modular kitchen, high-speed WiFi, power backup, and dedicated parking. 5 mins walk to IT companies.', 'FLAT', 14500.00, 30000.00, 2, CURRENT_DATE, 'ANY', 'FULLY_FURNISHED', 'WiFi, AC, Parking, Kitchen, TV, Power Backup, Security', 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM locations WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM accommodations WHERE id = 1);

INSERT INTO accommodations (id, owner_id, title, description, type, rent, deposit, location_id, available_from, gender_preference, furnished, facilities, status, created_at, updated_at)
SELECT 2, 1, 'Single Occupancy Room in Luxury PG - Wakad', 'Clean and quiet single occupancy room with attached bathroom, 3-time meals, daily housekeeping, and high-speed fiber internet.', 'PG', 8500.00, 10000.00, 2, CURRENT_DATE, 'MALE', 'FULLY_FURNISHED', 'Food Included, WiFi, Housekeeping, Geyser, Washing Machine', 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM locations WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM accommodations WHERE id = 2);

INSERT INTO accommodations (id, owner_id, title, description, type, rent, deposit, location_id, available_from, gender_preference, furnished, facilities, status, created_at, updated_at)
SELECT 3, 1, 'Flatmate Needed for 2BHK Flat in Koramangala', 'Looking for a friendly flatmate to share a 2BHK flat. Master bedroom with private balcony. Walking distance to Sony World Signal.', 'FLATMATE', 12000.00, 25000.00, 3, CURRENT_DATE, 'ANY', 'SEMI_FURNISHED', 'WiFi, Fridge, Washing Machine, Balcony, Elevator', 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM locations WHERE id = 3)
  AND NOT EXISTS (SELECT 1 FROM accommodations WHERE id = 3);
