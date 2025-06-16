-- Tabela posiłków
CREATE TABLE IF NOT EXISTS meals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  calories INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela składników
CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Tabela łącząca posiłki ze składnikami
CREATE TABLE IF NOT EXISTS meal_ingredients (
  meal_id INT REFERENCES meals(id) ON DELETE CASCADE,
  ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE,
  PRIMARY KEY (meal_id, ingredient_id)
);

-- Tabela lodówki 
CREATE TABLE IF NOT EXISTS fridge_ingredients (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  ingredient_id INT REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Tabela użytkowników
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
