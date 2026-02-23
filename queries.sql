-- Table users
CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  email    VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Table books
CREATE TABLE books (
  id        SERIAL PRIMARY KEY,
  user_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title     VARCHAR(255) NOT NULL,
  author    VARCHAR(255) NOT NULL,
  isbn      VARCHAR(20),
  rating    INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes     TEXT,
  date_read DATE
);