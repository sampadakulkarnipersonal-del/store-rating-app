CREATE DATABASE IF NOT EXISTS store_ratings_db;
USE store_ratings_db;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(60)  NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  address    VARCHAR(400),
  role       ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) >= 20 AND CHAR_LENGTH(name) <= 60)
);

-- ── Stores ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stores (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(60)  NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  address    VARCHAR(400),
  owner_id   INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_store_name_length CHECK (CHAR_LENGTH(name) >= 20 AND CHAR_LENGTH(name) <= 60),
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Ratings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ratings (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  store_id   INT NOT NULL,
  rating     INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_store (user_id, store_id),
  CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5),
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE OR REPLACE VIEW store_ratings_summary AS
SELECT
  s.id,
  s.name,
  s.email,
  s.address,
  s.owner_id,
  COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
  COUNT(r.id)                           AS total_ratings
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
GROUP BY s.id, s.name, s.email, s.address, s.owner_id;

INSERT IGNORE INTO users (name, email, password, address, role)
VALUES (
  'System Administrator Account',
  'admin@storerating.com',
  '$2b$12$placeholder_will_be_seeded_by_app',
  '123 Admin Street, Main City, State',
  'admin'
);
