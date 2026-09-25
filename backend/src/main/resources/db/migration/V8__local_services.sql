-- Phase 8 Migration: Local Services, Places & Relocation Assistance Infrastructure
-- Creates recommendations and recommendation_favorites tables with indexes and initial verified seeds

CREATE TABLE IF NOT EXISTS recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    subcategory VARCHAR(100) NULL,
    address VARCHAR(300) NULL,
    phone VARCHAR(50) NULL,
    website VARCHAR(300) NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    opening_hours VARCHAR(100) NULL,
    rating DECIMAL(2,1) DEFAULT 5.0,
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rec_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_location FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS recommendation_favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recommendation_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rf_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rf_recommendation FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE,
    CONSTRAINT uk_rec_favorite UNIQUE (user_id, recommendation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance indexes
CREATE INDEX idx_rec_search ON recommendations(location_id, category, status);
CREATE INDEX idx_rec_user ON recommendations(user_id);
CREATE INDEX idx_rf_user ON recommendation_favorites(user_id);

-- Initial verified seed places in Pune (Hinjawadi/Wakad) and Bangalore (Koramangala) for default user (id 1)
INSERT INTO recommendations (id, user_id, location_id, title, description, category, subcategory, address, phone, website, latitude, longitude, opening_hours, rating, status, created_at, updated_at)
SELECT 1, 1, 2, 'Ruby Hall Clinic - Hinjawadi', '24x7 Multi-specialty tertiary care hospital with emergency ICU and pharmacy services.', 'HEALTHCARE', 'Hospital', 'Rajiv Gandhi InfoTech Park, Phase 1, Hinjawadi, Pune, Maharashtra 411057', '+91 20 6649 4949', 'https://rubyhall.com', 18.59120000, 73.73890000, '24/7 Open', 4.8, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM locations WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM recommendations WHERE id = 1);

INSERT INTO recommendations (id, user_id, location_id, title, description, category, subcategory, address, phone, website, latitude, longitude, opening_hours, rating, status, created_at, updated_at)
SELECT 2, 1, 2, 'Apollo Pharmacy - Hinjawadi Phase 1', 'Reliable 24x7 medical store stocking all prescription medicines, healthcare products, and first-aid essentials.', 'HEALTHCARE', 'Pharmacy', 'Shop 4, Ground Floor, Main Road, Hinjawadi Phase 1, Pune 411057', '+91 20 2293 8811', 'https://apollopharmacy.in', 18.59250000, 73.74010000, '24/7 Open', 4.7, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM locations WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM recommendations WHERE id = 2);

INSERT INTO recommendations (id, user_id, location_id, title, description, category, subcategory, address, phone, website, latitude, longitude, opening_hours, rating, status, created_at, updated_at)
SELECT 3, 1, 2, 'Hinjawadi Phase 1 Bus Stop & Metro Station', 'Major public transit terminal connecting Hinjawadi to Pune Station, Swargate, and Shivaji Nagar.', 'TRANSPORT', 'Bus & Metro', 'Hinjawadi Main Chowk, Phase 1, Pune 411057', '+91 20 2444 0417', 'https://pmpml.org', 18.59050000, 73.73750000, '5:00 AM - 11:30 PM', 4.6, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM locations WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM recommendations WHERE id = 3);

INSERT INTO recommendations (id, user_id, location_id, title, description, category, subcategory, address, phone, website, latitude, longitude, opening_hours, rating, status, created_at, updated_at)
SELECT 4, 1, 2, 'D-Mart Supermarket - Wakad Hinjawadi Road', 'Massive hypermarket for daily groceries, fresh produce, home supplies, and kitchenware at wholesale prices.', 'GROCERY', 'Supermarket', 'Near Bhumkar Chowk, Wakad, Pune 411057', '+91 20 3300 4400', 'https://dmart.in', 18.59980000, 73.75510000, '8:00 AM - 10:00 PM', 4.9, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM locations WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM recommendations WHERE id = 4);

INSERT INTO recommendations (id, user_id, location_id, title, description, category, subcategory, address, phone, website, latitude, longitude, opening_hours, rating, status, created_at, updated_at)
SELECT 5, 1, 3, 'Manipal Hospital - Koramangala', 'Premier multi-specialty healthcare facility with 24x7 emergency & trauma response.', 'HEALTHCARE', 'Hospital', '80 Feet Road, HAL 2nd Stage, Indiranagar/Koramangala, Bangalore 560008', '+91 80 2502 4444', 'https://manipalhospitals.com', 12.95850000, 77.64800000, '24/7 Open', 4.8, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM locations WHERE id = 3)
  AND NOT EXISTS (SELECT 1 FROM recommendations WHERE id = 5);
