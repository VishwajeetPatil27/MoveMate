-- MoveMate Database Migration V5: Community Feed, Posts, Comments, Likes & Reports Foundation

-- 1. Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    community_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    post_type VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_post_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_community FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    INDEX idx_post_community_time (community_id, created_at DESC),
    INDEX idx_post_author (user_id)
) ENGINE=InnoDB;

-- 2. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_comment_post (post_id, created_at ASC),
    INDEX idx_comment_author (user_id)
) ENGINE=InnoDB;

-- 3. Likes Table (Post Reactions)
CREATE TABLE IF NOT EXISTS likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_like_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_post_user_like (post_id, user_id)
) ENGINE=InnoDB;

-- 4. Reports Table (Content Moderation)
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reported_by BIGINT NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id BIGINT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rep_reporter FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_report_target (target_type, target_id)
) ENGINE=InnoDB;

-- Seed Initial Community Discussion Posts for Seed Communities
INSERT INTO posts (user_id, community_id, title, content, post_type, status, created_at)
SELECT u.id, c.id, 'Which areas are good for IT employees near Hinjawadi?', 'I am moving to Pune next month for a software engineering job in Hinjawadi Phase 1. Looking for safe 1BHK/2BHK localities within 20-30 mins commute. Suggestions appreciated!', 'QUESTION', 'ACTIVE', NOW()
FROM users u, communities c
WHERE u.email = 'commcreator@example.com' OR u.email = 'test@example.com' OR u.id = 1
  AND (c.slug = 'pune-it-professionals-hub' OR c.id = 1)
LIMIT 1;

INSERT INTO posts (user_id, community_id, title, content, post_type, status, created_at)
SELECT u.id, c.id, 'Looking for 1BHK / Flatmate near Wakad or Kothrud', 'Budget is around ₹15,000. Preference for semi-furnished flat with good wifi and water supply. Please connect if any leads available!', 'ACCOMMODATION', 'ACTIVE', NOW()
FROM users u, communities c
WHERE u.email = 'commcreator@example.com' OR u.email = 'test@example.com' OR u.id = 1
  AND (c.slug = 'pune-it-professionals-hub' OR c.id = 1)
LIMIT 1;
