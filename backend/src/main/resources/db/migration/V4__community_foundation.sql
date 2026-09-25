-- MoveMate Phase 4: Community Foundation & Membership Schema
-- Migration File: V4__community_foundation.sql

-- 1. Communities Table
CREATE TABLE IF NOT EXISTS communities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NULL,
    origin_location_id BIGINT NOT NULL,
    destination_location_id BIGINT NOT NULL,
    language VARCHAR(50) NULL DEFAULT 'English',
    category VARCHAR(50) NOT NULL DEFAULT 'REGIONAL',
    cover_image VARCHAR(500) NULL,
    created_by BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_community_origin FOREIGN KEY (origin_location_id) REFERENCES locations(id),
    CONSTRAINT fk_community_dest FOREIGN KEY (destination_location_id) REFERENCES locations(id),
    CONSTRAINT fk_community_creator FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_community_route (origin_location_id, destination_location_id),
    INDEX idx_community_category (category),
    INDEX idx_community_status (status)
) ENGINE=InnoDB;

-- 2. Community Members Table
CREATE TABLE IF NOT EXISTS community_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    community_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cm_community FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_community_user UNIQUE (community_id, user_id),
    INDEX idx_cm_community (community_id),
    INDEX idx_cm_user (user_id)
) ENGINE=InnoDB;

-- Seed Initial Relocation Communities (Using existing seeded Location IDs: Sangli=1, Pune=2, Bangalore=3, Mumbai=4, Hyderabad=5)
-- Note: Created by system admin or default user ID 1 if present
INSERT INTO communities (name, slug, description, origin_location_id, destination_location_id, language, category, cover_image, created_by, status)
VALUES
('Pune IT Professionals Hub', 'pune-it-professionals-hub', 'Connect with fellow IT software engineers, developers, and tech leads relocating to Pune tech parks (Hinjawadi, Magarpatta, Baner).', 1, 2, 'English', 'PROFESSIONAL', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', 1, 'ACTIVE'),
('Sangli to Pune Relocators', 'sangli-to-pune-relocators', 'Regional community for people moving from Sangli / Western Maharashtra to Pune. Share housing, carpooling, and hometown connections.', 1, 2, 'Marathi', 'REGIONAL', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4', 1, 'ACTIVE'),
('Bangalore Tech & Startup Connect', 'bangalore-tech-and-startup-connect', 'Community for developers, product managers, and founders relocating to Bangalore (Koramangala, Indiranagar, Whitefield).', 2, 3, 'English', 'PROFESSIONAL', 'https://images.unsplash.com/photo-1531482615713-2afd69097998', 1, 'ACTIVE'),
('Mumbai Career Newcomers', 'mumbai-career-newcomers', 'Guidance, housing tips, and networking for professionals and freshers relocating to Mumbai & Navi Mumbai.', 2, 4, 'English', 'JOB', 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f', 1, 'ACTIVE')
ON DUPLICATE KEY UPDATE name=name;
