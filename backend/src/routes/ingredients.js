const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('./auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM ingredients ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu składników' });
  }
});

module.exports = router;
