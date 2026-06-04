CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  media_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  release_year INT,
  genres TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  media_id INT REFERENCES media(id) NOT NULL,
  user_id INT REFERENCES users(id) NOT NULL,
  review TEXT,
  date_film DATE,
  watched_before BOOLEAN DEFAULT FALSE,
  liked BOOLEAN DEFAULT FALSE,
  rate FLOAT,
  acting FLOAT,
  direction FLOAT,
  photography FLOAT,
  screenplay FLOAT,
  soundtrack FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);
