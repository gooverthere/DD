<template>
  <div class="available-meals">
    <h2>Możliwe do przygotowania posiłki</h2>
    <ul>
      <li v-for="meal in meals" :key="meal.id" class="meal-card">
        <div class="meal-header">
          <strong class="meal-name">{{ meal.name }}</strong>
          <span class="meal-calories">{{ meal.calories }} kcal</span>
        </div>
        <p class="meal-description">{{ meal.description }}</p>
        <div class="ingredients">
          <span 
            v-for="(ingredient, idx) in meal.ingredients" 
            :key="idx" 
            class="ingredient-tag"
          >
            {{ ingredient }}
          </span>
        </div>
      </li>
    </ul>
    <p v-if="meals.length === 0" class="empty-msg">Brak posiłków do wyświetlenia.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authFetch } from '../api';

const meals = ref([]);

async function fetchAvailableMeals() {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/fridge/available-meals`);
  if (res.ok) {
    meals.value = await res.json();
  }
}

onMounted(() => {
  fetchAvailableMeals();
});
</script>

<style scoped>
.available-meals {
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.8rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.meal-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  padding: 1rem 1.5rem;
  margin-bottom: 1.2rem;
  transition: transform 0.2s ease;
}

.meal-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.meal-name {
  font-size: 1.3rem;
  color: #2c3e50;
}

.meal-calories {
  background-color: #42b983;
  color: white;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
  user-select: none;
}

.meal-description {
  font-style: italic;
  color: #555;
  margin-bottom: 0.8rem;
}

.ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ingredient-tag {
  background-color: #e0f2f1;
  color: #00796b;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  user-select: none;
}

.empty-msg {
  text-align: center;
  color: #999;
  font-style: italic;
  margin-top: 2rem;
}
</style>
