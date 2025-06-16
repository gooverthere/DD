<template>
  <div class="fridge-container container">
    <h2>Lodówka</h2>

    <h3>Co masz w lodówce?</h3>
    <ul class="fridge-list">
      <li v-for="ingredient in fridgeIngredients" :key="ingredient.id" class="fridge-item card">
        <span>{{ ingredient.name }}</span>
        <button class="remove-btn btn-danger" @click="removeFromFridge(ingredient.id)" aria-label="Usuń składnik">
          &times;
        </button>
      </li>
      <li v-if="fridgeIngredients.length === 0" class="empty-msg">Lodówka jest pusta.</li>
    </ul>

    <h3>Dodaj składniki do lodówki</h3>
    <div class="add-ingredient">
      <select v-model="selectedIngredient" class="ingredient-select input">
        <option disabled value="">Wybierz składnik</option>
        <option
          v-for="ingredient in filteredAvailableIngredients"
          :key="ingredient.id"
          :value="ingredient.id"
        >
          {{ ingredient.name }}
        </option>
      </select>
      <button class="add-btn btn-primary" @click="addToFridge" :disabled="!selectedIngredient">Dodaj</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { authFetch } from '../api';

const fridgeIngredients = ref([]);
const availableIngredients = ref([]);
const selectedIngredient = ref('');

const fridgeIngredientsIds = computed(() => new Set(fridgeIngredients.value.map(i => i.id)));

const filteredAvailableIngredients = computed(() =>
  availableIngredients.value.filter(ingredient => !fridgeIngredientsIds.value.has(ingredient.id))
);

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

<style scoped>
.fridge-container {
  margin: var(--space-xl) auto;
}

h2, h3 {
  color: var(--secondary-color);
  margin-bottom: var(--space-md);
}

.fridge-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-xl) 0;
}

.fridge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-light);
  padding: var(--space-sm) var(--space-md);
  margin-bottom: var(--space-xs);
  transition: background-color var(--transition-normal);
}

.fridge-item:hover {
  background-color: #e1e8f0;
}

.remove-btn {
  border: none;
  font-weight: bold;
  font-size: 1.2rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  line-height: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-msg {
  font-style: italic;
  color: var(--text-lighter);
  text-align: center;
  margin-bottom: var(--space-xl);
}

.add-ingredient {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.ingredient-select {
  flex-grow: 1;
  transition: border-color var(--transition-normal);
}

.ingredient-select:focus {
  border-color: var(--primary-color);
}

.add-btn:disabled {
  background-color: var(--primary-light);
  cursor: not-allowed;
}
</style>