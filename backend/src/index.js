const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { router: authRoutes } = require('./routes/auth');
const mealsRoutes = require('./routes/meals');
const fridgeRoutes = require('./routes/fridge');
const ingredientsRoutes = require('./routes/ingredients');
const calendarRouter = require('./routes/calendar');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/fridge', fridgeRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/calendar', calendarRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
