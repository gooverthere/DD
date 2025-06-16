<template>
  <div>
    <h2>Twoja lodówka</h2>
    <p>Składniki aktualnie w lodówce:</p>
    <ul>
      <li v-for="ingredient in fridgeContents" :key="ingredient.id">
        {{ ingredient.name }}
      </li>
    </ul>

    <form @submit.prevent="saveFridge">
      <h3>Dodaj składniki do lodówki:</h3>
      <div v-for="ingredient in ingredients" :key="ingredient.id">
        <label>
          <input type="checkbox" :value="ingredient.id" v-model="selectedIngredients" />
          {{ ingredient.name }}
        </label>
      </div>
      <button type="submit">Zapisz lodówkę</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authFetch } from '../api';

const ingredients = ref([]);
const selectedIngredients = ref([]);
const fridgeContents = ref([]);

async function fetchIngredients() {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/ingredients`);
  if (res.ok) {
    ingredients.value = await res.json();
  }
}

async function fetchFridgeContents() {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/fridge/current`);
  if (res.ok) {
    fridgeContents.value = await res.json();
  }
}

async function saveFridge() {
  await authFetch(`${import.meta.env.VITE_API_URL}/api/fridge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients: selectedIngredients.value }),
  });
  await fetchFridgeContents();
}

onMounted(() => {
  fetchIngredients();
  fetchFridgeContents();
});
</script>

<style scoped>
form {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}
</style>
