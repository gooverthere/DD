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

-- Przykładowe składniki (30)
INSERT INTO ingredients (name) VALUES
('Pomidor'),
('Ogórek'),
('Ser feta'),
('Kurczak'),
('Ryż'),
('Płatki owsiane'),
('Miód'),
('Owoce'),
('Sałata'),
('Cebula'),
('Czosnek'),
('Papryka'),
('Marchewka'),
('Ziemniaki'),
('Makaron'),
('Tuńczyk'),
('Jajka'),
('Szpinak'),
('Kukurydza'),
('Jogurt'),
('Awokado'),
('Banan'),
('Truskawki'),
('Migdały'),
('Orzechy włoskie'),
('Ser żółty'),
('Masło'),
('Mleko'),
('Kiełbasa'),
('Chleb');

-- Przykładowe posiłki (30)
INSERT INTO meals (name, description, calories) VALUES
('Sałatka grecka', 'Sałatka z pomidorów, ogórków, oliwek i sera feta.', 250),
('Kurczak z ryżem', 'Pieczony kurczak z ryżem i warzywami.', 550),
('Owsianka', 'Owsianka z owocami i miodem.', 300),
('Spaghetti Bolognese', 'Makaron z sosem mięsnym i pomidorowym.', 600),
('Tosty z awokado', 'Chleb tostowy z awokado i jajkiem.', 350),
('Omlet ze szpinakiem', 'Jajka z szpinakiem i serem żółtym.', 400),
('Sałatka z tuńczykiem', 'Tuńczyk z sałatą, kukurydzą i jajkiem.', 320),
('Zupa pomidorowa', 'Klasyczna zupa pomidorowa z makaronem.', 280),
('Kanapka z kiełbasą', 'Chleb z kiełbasą, serem i warzywami.', 450),
('Smoothie bananowe', 'Banan, jogurt i miód zmiksowane na smoothie.', 220),
('Risotto z kurczakiem', 'Kremowe risotto z kurczakiem i warzywami.', 580),
('Sałatka owocowa', 'Mix świeżych owoców z miodem.', 210),
('Zapiekanka ziemniaczana', 'Ziemniaki zapiekane z serem i boczkiem.', 650),
('Pasta z awokado', 'Makaron z kremową pastą z awokado.', 420),
('Jajka sadzone z kiełbasą', 'Jajka sadzone podane z kiełbasą.', 500),
('Kanapka z serem żółtym', 'Chleb z masłem i serem żółtym.', 300),
('Sałatka warzywna', 'Mix sałaty, papryki, cebuli i marchewki.', 280),
('Płatki owsiane z mlekiem', 'Płatki owsiane zalane mlekiem.', 330),
('Koktajl truskawkowy', 'Truskawki zmiksowane z jogurtem i mlekiem.', 240),
('Grillowana pierś kurczaka', 'Pierś kurczaka z przyprawami i warzywami.', 520),
('Tortilla z warzywami', 'Tortilla z warzywami i serem feta.', 460),
('Zupa jarzynowa', 'Zupa z marchewki, ziemniaków i kukurydzy.', 300),
('Placki ziemniaczane', 'Smażone placki z ziemniaków.', 550),
('Sałatka z awokado i orzechami', 'Awokado z orzechami włoskimi i sałatą.', 400),
('Kanapka z masłem orzechowym i bananem', 'Chleb z masłem orzechowym i plasterkami banana.', 350),
('Smażony ryż z warzywami', 'Ryż smażony z marchewką i papryką.', 480),
('Jajecznica z cebulą', 'Jajecznica z cebulą i masłem.', 420),
('Makaron z sosem śmietanowym', 'Makaron z kremowym sosem i szpinakiem.', 530),
('Szaszłyki z kurczaka', 'Grillowane szaszłyki z kurczaka i papryki.', 490),
('Jogurt z migdałami', 'Jogurt naturalny z migdałami i miodem.', 250),
('Chleb z masłem i dżemem', 'Prosta kanapka z masłem i dżemem.', 320);

-- Powiązania meal -> składniki

-- Sałatka grecka: Pomidor, Ogórek, Ser feta
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(1, 1), -- Pomidor
(1, 2), -- Ogórek
(1, 3);

-- Kurczak z ryżem: Kurczak, Ryż
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(2, 4),
(2, 5);

-- Owsianka: Płatki owsiane, Miód, Owoce
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(3, 6),
(3, 7),
(3, 8);

-- Spaghetti Bolognese: Makaron, Cebula, Czosnek, Pomidor
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(4, 15),
(4, 10),
(4, 11),
(4, 1);

-- Tosty z awokado: Chleb, Awokado, Jajka
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(5, 29),
(5, 20),
(5, 17);

-- Omlet ze szpinakiem: Jajka, Szpinak, Ser żółty
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(6, 17),
(6, 18),
(6, 25);

-- Sałatka z tuńczykiem: Tuńczyk, Sałata, Kukurydza, Jajka
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(7, 16),
(7, 9),
(7, 19),
(7, 17);

-- Zupa pomidorowa: Pomidor, Makaron, Cebula, Czosnek
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(8, 1),
(8, 15),
(8, 10),
(8, 11);

-- Kanapka z kiełbasą: Chleb, Kiełbasa, Ser żółty
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(9, 29),
(9, 28),
(9, 25);

-- Smoothie bananowe: Banan, Jogurt, Miód
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(10, 21),
(10, 20),
(10, 7);

-- Risotto z kurczakiem: Ryż, Kurczak, Marchewka, Cebula
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(11, 5),
(11, 4),
(11, 13),
(11, 10);

-- Sałatka owocowa: Owoce, Miód
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(12, 8),
(12, 7);

-- Zapiekanka ziemniaczana: Ziemniaki, Ser żółty, Boczek (brak boczku w liście składników, pomijamy)
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(13, 14),
(13, 25);

-- Pasta z awokado: Makaron, Awokado, Czosnek
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(14, 15),
(14, 20),
(14, 11);

-- Jajka sadzone z kiełbasą: Jajka, Kiełbasa
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(15, 17),
(15, 28);

-- Kanapka z serem żółtym: Chleb, Masło, Ser żółty
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(16, 29),
(16, 26),
(16, 25);

-- Sałatka warzywna: Sałata, Papryka, Cebula, Marchewka
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(17, 9),
(17, 12),
(17, 10),
(17, 13);

-- Płatki owsiane z mlekiem: Płatki owsiane, Mleko
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(18, 6),
(18, 27);

-- Koktajl truskawkowy: Truskawki, Jogurt, Mleko
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(19, 22),
(19, 20),
(19, 27);

-- Grillowana pierś kurczaka: Kurczak, Papryka
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(20, 4),
(20, 12);

-- Tortilla z warzywami: Tortilla brak w składnikach (pomijamy), Papryka, Ser feta
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(21, 12),
(21, 3);

-- Zupa jarzynowa: Marchewka, Ziemniaki, Kukurydza
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(22, 13),
(22, 14),
(22, 19);

-- Placki ziemniaczane: Ziemniaki
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(23, 14);

-- Sałatka z awokado i orzechami: Awokado, Orzechy włoskie, Sałata
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(24, 20),
(24, 24),
(24, 9);

-- Kanapka z masłem orzechowym i bananem: Chleb, Masło orzechowe brak w składnikach (pomijamy), Banan
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(25, 29),
(25, 21);

-- Smażony ryż z warzywami: Ryż, Marchewka, Papryka
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(26, 5),
(26, 13),
(26, 12);

-- Jajecznica z cebulą: Jajka, Cebula, Masło
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(27, 17),
(27, 10),
(27, 26);

-- Makaron z sosem śmietanowym: Makaron, Szpinak, Masło
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(28, 15),
(28, 18),
(28, 26);

-- Szaszłyki z kurczaka: Kurczak, Papryka
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(29, 4),
(29, 12);

-- Jogurt z migdałami: Jogurt, Migdały, Miód
INSERT INTO meal_ingredients (meal_id, ingredient_id) VALUES
(30, 20),
(30, 23),
(30, 7);

-- Przykładowe dane: użytkownik "admin" ma kilka składników w lodówce
INSERT INTO fridge_ingredients (username, ingredient_id) VALUES
('admin', 1),
('admin', 2),
('admin', 3),
('admin', 4),
('admin', 5);


-- INSERT INTO fridge_ingredients (username, ingredient_id) VALUES
-- ('admin', 1),
-- ('admin', 2),
-- ('admin', 3),
-- ('admin', 4),
-- ('admin', 5);


INSERT INTO users (username, password_hash) VALUES
('admin', '$2a$10$VtcscreZEM9EzlG1Zs6treMAUhZGq/cRKmgDC.ctDJnkBoEZ/boPW');
