-- SkillSwap initial schema

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    role          VARCHAR(20)  NOT NULL,
    active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL,
    updated_at    TIMESTAMP    NOT NULL
);

CREATE TABLE profiles (
    user_id    BIGINT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    headline   VARCHAR(120),
    about      VARCHAR(2000),
    phone      VARCHAR(30),
    country    VARCHAR(100),
    city       VARCHAR(100),
    address    VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX ix_profiles_city ON profiles (LOWER(city));

CREATE TABLE skills (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(80) NOT NULL,
    normalized_name VARCHAR(80) NOT NULL UNIQUE,
    created_at      TIMESTAMP   NOT NULL
);

CREATE TABLE user_skills (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    skill_id    BIGINT       NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    type        VARCHAR(10)  NOT NULL,
    level       VARCHAR(20)  NOT NULL,
    mode        VARCHAR(20)  NOT NULL,
    description VARCHAR(1000),
    city        VARCHAR(100),
    location    VARCHAR(255),
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,
    CONSTRAINT uq_user_skill_type UNIQUE (user_id, skill_id, type)
);

CREATE INDEX ix_user_skills_skill_type ON user_skills (skill_id, type);

CREATE TABLE exchange_requests (
    id                 BIGSERIAL PRIMARY KEY,
    sender_id          BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    recipient_id       BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    -- what the sender wants to learn from the recipient
    requested_skill_id BIGINT      REFERENCES skills (id) ON DELETE SET NULL,
    -- what the sender offers to teach in return (optional)
    offered_skill_id   BIGINT      REFERENCES skills (id) ON DELETE SET NULL,
    message            VARCHAR(500),
    status             VARCHAR(20) NOT NULL,
    created_at         TIMESTAMP   NOT NULL,
    responded_at       TIMESTAMP,
    CONSTRAINT ck_request_not_self CHECK (sender_id <> recipient_id)
);

CREATE INDEX ix_requests_sender ON exchange_requests (sender_id, status);
CREATE INDEX ix_requests_recipient ON exchange_requests (recipient_id, status);

-- At most one pending request between any two users, regardless of direction
CREATE UNIQUE INDEX uq_requests_pending_pair
    ON exchange_requests (LEAST(sender_id, recipient_id), GREATEST(sender_id, recipient_id))
    WHERE status = 'PENDING';
