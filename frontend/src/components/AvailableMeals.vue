<template>
  <div>
    <h2>Możliwe do przygotowania posiłki</h2>
    <ul>
      <li v-for="meal in meals" :key="meal.id">
        <strong>{{ meal.name }}</strong> - {{ meal.calories }} kcal<br />
        <em>{{ meal.description }}</em>
        <p>Składniki: {{ meal.ingredients.join(', ') }}</p>
      </li>
    </ul>
    <p v-if="meals.length === 0">Brak posiłków do wyświetlenia.</p>
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
ul {
  margin-top: 1rem;
  padding-left: 1rem;
}
li {
  margin-bottom: 1rem;
}
</style>
