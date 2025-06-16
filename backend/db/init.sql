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

-- Przykładowe posiłki
INSERT INTO meals (name, description, calories) VALUES
('Sałatka grecka', 'Sałatka z pomidorów, ogórków, oliwek i sera feta.', 250),
('Kurczak z ryżem', 'Pieczony kurczak z ryżem i warzywami.', 550),
('Owsianka', 'Owsianka z owocami i miodem.', 300);

-- Przykładowe składniki
INSERT INTO ingredients (name) VALUES
('Pomidor'),
('Ogórek'),
('Ser feta'),
('Kurczak'),
('Ryż'),
('Płatki owsiane'),
('Miód'),
('Owoce');

-- Powiązania meal -> składniki

-- Sałatka grecka: Pomidor, Ogórek, Ser feta
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(1, 1), -- Pomidor
(1, 2), -- Ogórek
(1, 3); -- Ser feta

-- Kurczak z ryżem: Kurczak, Ryż
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(2, 4), -- Kurczak
(2, 5); -- Ryż

-- Owsianka: Płatki owsiane, Miód, Owoce
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(3, 6), -- Płatki owsiane
(3, 7), -- Miód
(3, 8); -- Owoce

-- Przykładowe dane: użytkownik "admin" ma kilka składników w lodówce
INSERT INTO fridge_ingredients (username, ingredient_id) VALUES
('admin', 1),
('admin', 2),
('admin', 3),
('admin', 4),
('admin', 5);
