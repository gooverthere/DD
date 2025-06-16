const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const pool = require('../db');

// Zwróć aktualne składniki w lodówce użytkownika
router.get('/current', authenticateToken, async (req, res) => {
  const username = req.user.username;

  try {
    const result = await pool.query(`
      SELECT i.id, i.name
      FROM fridge_ingredients f
      JOIN ingredients i ON i.id = f.ingredient_id
      WHERE f.username = $1
      ORDER BY i.name ASC
    `, [username]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});
// Dodaj lub usuń składniki z lodówki użytkownika
router.patch('/', authenticateToken, async (req, res) => {
  const { add = [], remove = [] } = req.body;
  const username = req.user.username;

  try {
    // Dodaj nowe
    for (const ingredientId of add) {
      await pool.query(
        'INSERT INTO fridge_ingredients (username, ingredient_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [username, ingredientId]
      );
    }

    // Usuń wybrane
    for (const ingredientId of remove) {
      await pool.query(
        'DELETE FROM fridge_ingredients WHERE username = $1 AND ingredient_id = $2',
        [username, ingredientId]
      );
    }

    res.json({ message: 'Zaktualizowano lodówkę' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera przy aktualizacji' });
  }
});


// Posiłki możliwe do przygotowania z lodówki
router.get('/available-meals', authenticateToken, async (req, res) => {
  const username = req.user.username;

  try {
    // Składniki w lodówce
    const result = await pool.query(
      `SELECT ingredient_id FROM fridge_ingredients WHERE username = $1`,
      [username]
    );
    const availableIds = result.rows.map(r => r.ingredient_id);

    if (availableIds.length === 0) {
      return res.json([]);
    }

    // Posiłki, które można przygotować tylko z tych składników
    const mealsResult = await pool.query(`
      SELECT m.*, array_agg(i.name) AS ingredients
      FROM meals m
      JOIN meal_ingredients mi ON mi.meal_id = m.id
      JOIN ingredients i ON i.id = mi.ingredient_id
      GROUP BY m.id
      HAVING bool_and(mi.ingredient_id = ANY($1::int[]))
    `, [availableIds]);

    res.json(mealsResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
