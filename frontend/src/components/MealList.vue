<template>
  <div>
    <h2>Lista posiłków</h2>
    <ul v-if="meals.length">
      <li v-for="meal in meals" :key="meal.id" style="margin-bottom: 1rem;">
        <strong>{{ meal.name }}</strong> — {{ meal.calories ?? 'brak kcal' }} kcal<br />
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

    <hr />

    <h2>Dodaj nowy posiłek</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Nazwa:</label>
        <input id="name" v-model="name" required />
      </div>

      <div>
        <label for="description">Opis:</label>
        <textarea id="description" v-model="description" />
      </div>

      <div>
        <label>Składniki:</label>
        <div v-if="ingredients.length === 0">Ładowanie składników...</div>
        <div v-else>
          <label
            v-for="ingredient in ingredients"
            :key="ingredient.id"
            style="display: block; margin-bottom: 0.25rem;"
          >
            <input
              type="checkbox"
              :value="ingredient.id"
              v-model="selectedIngredients"
            />
            {{ ingredient.name }}
          </label>
        </div>
      </div>

      <button type="submit" :disabled="!name || selectedIngredients.length === 0">
        Dodaj posiłek
      </button>
    </form>

    <div v-if="message" :style="{ marginTop: '1rem', color: messageColor }">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authFetch } from '../api';

const meals = ref([]);
const name = ref('');
const description = ref('');
const ingredients = ref([]);
const selectedIngredients = ref([]);
const message = ref('');
const messageColor = ref('green');

async function loadMeals() {
  try {
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/meals/list`);
    if (!res.ok) throw new Error('Błąd pobierania posiłków');
    meals.value = await res.json();
  } catch (e) {
    console.error(e);
    meals.value = [];
  }
}

async function loadIngredients() {
  try {
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/ingredients`);
    if (!res.ok) throw new Error('Błąd ładowania składników');
    ingredients.value = await res.json();
  } catch (e) {
    console.error(e);
    ingredients.value = [];
    message.value = 'Błąd ładowania składników';
    messageColor.value = 'red';
  }
}

async function submitForm() {
  message.value = '';
  const payload = {
    name: name.value.trim(),
    description: description.value.trim(),
    ingredients: selectedIngredients.value,
  };

  try {
    const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/meals/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Błąd dodawania posiłku');
    }

    message.value = 'Posiłek dodany pomyślnie!';
    messageColor.value = 'green';
    name.value = '';
    description.value = '';
    selectedIngredients.value = [];
    await loadMeals(); // odśwież listę po dodaniu
  } catch (e) {
    message.value = e.message;
    messageColor.value = 'red';
  }
}

onMounted(() => {
  loadMeals();
  loadIngredients();
});
</script>

<style scoped>
form > div {
  margin-bottom: 1rem;
}
</style>
