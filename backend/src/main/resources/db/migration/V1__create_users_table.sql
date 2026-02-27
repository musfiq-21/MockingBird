-- V1: Create users table
CREATE TABLE IF NOT EXISTS users (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100)        NOT NULL,
    username     VARCHAR(50)         NOT NULL UNIQUE,
    email        VARCHAR(150)        NOT NULL UNIQUE,
    password_hash VARCHAR(255)       NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
