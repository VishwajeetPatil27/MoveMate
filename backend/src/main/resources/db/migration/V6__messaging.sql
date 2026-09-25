-- Phase 6 Migration: Real-Time Messaging & Direct Communication Infrastructure
-- Creates conversations, conversation_members, and messages tables with indexes and initial seeds

CREATE TABLE IF NOT EXISTS conversations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'DIRECT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conversation_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP NULL,
    CONSTRAINT fk_cm_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_conversation_user UNIQUE (conversation_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'TEXT',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_msg_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for fast query resolution
CREATE INDEX idx_cm_user ON conversation_members(user_id);
CREATE INDEX idx_cm_conversation ON conversation_members(conversation_id);
CREATE INDEX idx_msg_conv_time ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_msg_sender ON messages(sender_id);

-- Initial seed conversation between default test users (id 1 and 2 if present)
INSERT INTO conversations (id, type, created_at, updated_at)
SELECT 1, 'DIRECT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1)
  AND EXISTS (SELECT 1 FROM users WHERE id = 2)
  AND NOT EXISTS (SELECT 1 FROM conversations WHERE id = 1);

INSERT INTO conversation_members (conversation_id, user_id, joined_at, last_read_at)
SELECT 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM conversations WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = 1 AND user_id = 1);

INSERT INTO conversation_members (conversation_id, user_id, joined_at, last_read_at)
SELECT 1, 2, CURRENT_TIMESTAMP, NULL
FROM DUAL
WHERE EXISTS (SELECT 1 FROM conversations WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = 1 AND user_id = 2);

INSERT INTO messages (conversation_id, sender_id, message, message_type, is_read, created_at)
SELECT 1, 1, 'Hi! Are you also relocating to Hinjewadi, Pune?', 'TEXT', TRUE, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM conversations WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM messages WHERE id = 1);

INSERT INTO messages (conversation_id, sender_id, message, message_type, is_read, created_at)
SELECT 1, 2, 'Yes! Moving next month for an IT role. Looking for 1BHK recommendations near Phase 1.', 'TEXT', FALSE, CURRENT_TIMESTAMP
FROM DUAL
WHERE EXISTS (SELECT 1 FROM conversations WHERE id = 1)
  AND NOT EXISTS (SELECT 1 FROM messages WHERE id = 2);
