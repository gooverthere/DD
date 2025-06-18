const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const { pool } = require('../db');

// GET /api/calendar/:date — pobranie posiłków na dany dzień
router.get('/:date', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const { date } = req.params;

  try {
    const result = await pool.query(`
      SELECT cm.id, m.name
      FROM calendar_meals cm
      JOIN meals m ON cm.meal_id = m.id
      WHERE cm.username = $1 AND cm.date = $2
    `, [username, date]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu posiłków' });
  }
});

// POST /api/calendar/:date/add-meal — dodanie posiłku do kalendarza
router.post('/:date/add-meal', authenticateToken, async (req, res) => {
  const username = req.user.username;
  const { date } = req.params;
  const { mealId } = req.body;

  if (!mealId) {
    return res.status(400).json({ message: 'Brak mealId w body' });
  }

  try {
    await pool.query(`
      INSERT INTO calendar_meals (username, meal_id, date)
      VALUES ($1, $2, $3)
    `, [username, mealId, date]);

    res.json({ message: 'Dodano posiłek do kalendarza' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera przy dodawaniu posiłku' });
  }
});

// DELETE /api/calendar/entry/:id — usuwanie wpisu z kalendarza po id
router.delete('/entry/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      DELETE FROM calendar_meals
      WHERE id = $1
    `, [id]);

    console.log('Delete result:', result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nie znaleziono wpisu do usunięcia' });
    }

    res.json({ message: 'Usunięto posiłek z kalendarza' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera przy usuwaniu posiłku' });
  }
});


module.exports = router;
