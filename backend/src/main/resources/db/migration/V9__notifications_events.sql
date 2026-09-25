-- Phase 9 Migration: Notifications, Community Events & Engagement Infrastructure
-- Creates notifications, events, and event_members tables with indexes and initial verified seeds

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    reference_id BIGINT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    community_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    location VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    capacity INT DEFAULT 50,
    status VARCHAR(50) DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_community FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'ATTENDING',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_em_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_em_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_event_user UNIQUE (event_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance indexes
CREATE INDEX idx_notif_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_event_community_date ON events(community_id, event_date);
CREATE INDEX idx_em_user ON event_members(user_id);

-- Initial verified seed events in Sangli->Pune community (id 1) and Pune Tech (id 2) for default user (id 1)
INSERT INTO events (id, community_id, created_by, title, description, location, event_date, capacity, status, created_at, updated_at)
SELECT 1, 1, 1, 'Pune Newcomers Weekend Meetup & Chai', 'Join us for a friendly weekend meetup to connect with fellow relocators, share flat hunting tips, and explore Pune together!', 'Cafeteria, Hinjawadi Phase 1, Pune', DATE_ADD(NOW(), INTERVAL 7 DAY), 40, 'UPCOMING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM communities WHERE id = 1)
  AND EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM events WHERE id = 1);

INSERT INTO events (id, community_id, created_by, title, description, location, event_date, capacity, status, created_at, updated_at)
SELECT 2, 2, 1, 'Bangalore Tech Relocation Networking', 'Networking event for software engineers, product managers, and tech workers relocating to Koramangala & HSR Layout.', 'Indiranagar Social, Bangalore', DATE_ADD(NOW(), INTERVAL 10 DAY), 60, 'UPCOMING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM communities WHERE id = 2)
  AND EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM events WHERE id = 2);

-- Seed initial RSVP for creator (id 1)
INSERT INTO event_members (id, event_id, user_id, status, joined_at)
SELECT 1, 1, 1, 'ATTENDING', CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM events WHERE id = 1)
  AND EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM event_members WHERE id = 1);

-- Seed initial welcome notification for default user (id 1)
INSERT INTO notifications (id, user_id, type, title, message, reference_id, is_read, created_at)
SELECT 1, 1, 'SYSTEM', 'Welcome to MoveMate Notifications!', 'Stay updated on community posts, event invitations, housing messages, and local service alerts.', NULL, FALSE, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM notifications WHERE id = 1);
