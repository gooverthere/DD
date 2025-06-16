const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const users = [
  // Hasło zahashowane bcryptem (przykład hasła 'admin')
  { username: 'admin', passwordHash: "$2a$10$VtcscreZEM9EzlG1Zs6treMAUhZGq/cRKmgDC.ctDJnkBoEZ/boPW" },
];

// Sekret JWT z .env
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// Rejestracja (prosty przykład, dodaj do users tablicy)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Użytkownik już istnieje' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash });
  res.json({ message: 'Zarejestrowano pomyślnie' });
});

// Logowanie
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Nieprawidłowe daneeeee' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Nieprawidłowe daneaaaa' });
  }

  // Generuj token (ważny 1h)
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
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
