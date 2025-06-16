<template>
  <div>
    <h2>Lista posiłków</h2>
    <ul v-if="meals.length">
      <li v-for="meal in meals" :key="meal.id" style="margin-bottom: 1rem;">
        <strong>{{ meal.name }}</strong> — {{ meal.calories }} kcal<br />
        <em>{{ meal.description }}</em>
        <p><strong>Składniki:</strong> 
          <span v-if="meal.ingredients.length">
            {{ meal.ingredients.map(i => i.name).join(', ') }}
          </span>
          <span v-else>Brak</span>
        </p>
      </li>
    </ul>
    <p v-else>Brak posiłków do wyświetlenia.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authFetch } from '../api';

const meals = ref([]);

async function loadMeals() {
  try {
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/meals/list`);
    if (!res.ok) throw new Error('Błąd pobierania posiłków');
    meals.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

onMounted(loadMeals);
</script>
