-- V3: Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id         BIGSERIAL PRIMARY KEY,
    news_id    BIGINT                   NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    user_id    BIGINT                   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text       TEXT                     NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
