const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');

// const users = [
//   // Hasło zahashowane bcryptem (przykład hasła 'admin')
//   { username: 'admin', passwordHash: "$2a$10$VtcscreZEM9EzlG1Zs6treMAUhZGq/cRKmgDC.ctDJnkBoEZ/boPW" },
// ];

// Sekret JWT z .env
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// Rejestracja (prosty przykład, dodaj do users tablicy)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username i hasło są wymagane.' });
  }

  try {
    // Sprawdź czy użytkownik już istnieje
    const userCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Użytkownik o takiej nazwie już istnieje.' });
    }

    // Zhashuj hasło
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Dodaj użytkownika do bazy
    await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
      [username, password_hash]
    );

    return res.status(201).json({ message: 'Rejestracja przebiegła pomyślnie.' });
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return res.status(500).json({ message: 'Błąd serwera.' });
  }
});

// Logowanie
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Pobierz użytkownika z bazy po username
    const result = await pool.query(
      'SELECT username, password_hash FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Nieprawidłowe dane' });
    }

    const user = result.rows[0];

    // Sprawdź hasło
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Nieprawidłowe dane' });
    }

    // Generuj token (ważny 1h)
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Middleware do weryfikacji tokena
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // username w req.user.username
    next();
  });
}

module.exports = { router, authenticateToken };
