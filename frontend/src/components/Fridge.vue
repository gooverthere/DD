<template>
  <div>
    <h2>Lodówka</h2>

    <h3>Co masz w lodówce?</h3>
    <ul>
      <li v-for="ingredient in fridgeIngredients" :key="ingredient.id">
        {{ ingredient.name }}
        <button @click="removeFromFridge(ingredient.id)">Usuń</button>
      </li>
      <li v-if="fridgeIngredients.length === 0">Lodówka jest pusta.</li>
    </ul>

    <h3>Dodaj składniki do lodówki</h3>
    <select v-model="selectedIngredient">
      <option disabled value="">Wybierz składnik</option>
      <option
        v-for="ingredient in availableIngredients"
        :key="ingredient.id"
        :value="ingredient.id"
        :disabled="fridgeIngredientsIds.has(ingredient.id)"
      >
        {{ ingredient.name }}
      </option>
    </select>
    <button @click="addToFridge" :disabled="!selectedIngredient">Dodaj</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { authFetch } from '../api';

const fridgeIngredients = ref([]);
const availableIngredients = ref([]);
const selectedIngredient = ref('');

// Ustaw zbiór ID składników w lodówce dla szybkiej walidacji
const fridgeIngredientsIds = computed(() => new Set(fridgeIngredients.value.map(i => i.id)));

async function fetchFridge() {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/fridge/current`);
  if (res.ok) {
    fridgeIngredients.value = await res.json();
  }
}

async function fetchAllIngredients() {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/ingredients`);
  if (res.ok) {
    availableIngredients.value = await res.json();
  }
}

async function addToFridge() {
  if (!selectedIngredient.value) return;

  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/fridge`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ add: [Number(selectedIngredient.value)] }),
  });

  if (res.ok) {
    await fetchFridge();
    selectedIngredient.value = '';
  } else {
    alert('Błąd podczas dodawania składnika');
  }
}

async function removeFromFridge(ingredientId) {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/fridge`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ remove: [ingredientId] }),
  });

  if (res.ok) {
    await fetchFridge();
  } else {
    alert('Błąd podczas usuwania składnika');
  }
}

onMounted(async () => {
  await fetchFridge();
  await fetchAllIngredients();
});
</script>
