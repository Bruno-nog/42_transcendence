CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  external_id TEXT NOT NULL,
  media_type TEXT NOT NULL,
  title TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_url TEXT,
  release_year INT,
  genres TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);