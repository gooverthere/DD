const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const pool = require('../db');

router.get('/list', authenticateToken, async (req, res) => {
  try {
    const mealsResult = await pool.query('SELECT * FROM meals ORDER BY created_at DESC');

    const meals = await Promise.all(
      mealsResult.rows.map(async (meal) => {
        const ingredientsResult = await pool.query(
          `SELECT i.id, i.name FROM ingredients i
           JOIN meal_ingredients mi ON i.id = mi.ingredient_id
           WHERE mi.meal_id = $1`,
          [meal.id]
        );
        return {
          ...meal,
          ingredients: ingredientsResult.rows,
        };
      })
    );

    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
