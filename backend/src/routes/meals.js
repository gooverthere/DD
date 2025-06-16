const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const pool = require('../db');

// GET /list - lista posiłków z składnikami
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

// POST /add - dodanie nowego posiłku z składnikami
router.post('/add', authenticateToken, async (req, res) => {
  const { name, description, calories, ingredients } = req.body; 
  // ingredients - tablica ID składników, np. [1, 4, 7]

  if (!name || !Array.isArray(ingredients)) {
    return res.status(400).json({ message: 'Brak wymaganych danych: name i ingredients' });
  }

  try {
    await pool.query('BEGIN');

    const insertMealText = `
      INSERT INTO meals (name, description, calories, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `;
    const mealResult = await pool.query(insertMealText, [name, description || null, calories || null]);
    const mealId = mealResult.rows[0].id;

    const insertIngredientsText = `
      INSERT INTO meal_ingredients (meal_id, ingredient_id)
      VALUES ($1, $2)
    `;

    for (const ingredientId of ingredients) {
      await pool.query(insertIngredientsText, [mealId, ingredientId]);
    }w

    await pool.query('COMMIT');

    res.status(201).json({ message: 'Posiłek dodany', mealId });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera podczas dodawania posiłku' });
  } finally {
  }
});

module.exports = router;
