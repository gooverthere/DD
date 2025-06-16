<template>
  <div class="available-meals container">
    <h2>Możliwe do przygotowania posiłki</h2>
    <ul>
      <li v-for="meal in meals" :key="meal.id" class="meal-card card">
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
  margin: var(--space-xl) auto;
}

h2 {
  text-align: center;
  color: var(--secondary-color);
  margin-bottom: var(--space-lg);
  font-weight: 700;
  font-size: 1.8rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.meal-card {
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-md);
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.meal-name {
  font-size: 1.3rem;
  color: var(--secondary-color);
}

.meal-calories {
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
  padding: var(--space-xs) var(--space-sm);
  border-radius: 15px;
  font-size: 0.9rem;
  user-select: none;
}

.meal-description {
  font-style: italic;
  color: var(--text-light);
  margin-bottom: var(--space-sm);
}

.ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.ingredient-tag {
  background-color: #e0f2f1;
  color: #00796b;
  padding: var(--space-xs) var(--space-sm);
  border-radius: 12px;
  font-size: 0.85rem;
  user-select: none;
}

.empty-msg {
  text-align: center;
  color: var(--text-lightest);
  font-style: italic;
  margin-top: var(--space-xl);
}
</style>