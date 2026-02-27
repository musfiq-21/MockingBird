-- V2: Create news table
CREATE TABLE IF NOT EXISTS news (
    id         BIGSERIAL PRIMARY KEY,
    title      VARCHAR(300)             NOT NULL,
    body       TEXT                     NOT NULL,
    author_id  BIGINT                   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
