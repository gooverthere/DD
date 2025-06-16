<template>
  <div class="fridge-container">
    <h2>Lodówka</h2>

    <h3>Co masz w lodówce?</h3>
    <ul class="fridge-list">
      <li v-for="ingredient in fridgeIngredients" :key="ingredient.id" class="fridge-item">
        <span>{{ ingredient.name }}</span>
        <button class="remove-btn" @click="removeFromFridge(ingredient.id)" aria-label="Usuń składnik">
          &times;
        </button>
      </li>
      <li v-if="fridgeIngredients.length === 0" class="empty-msg">Lodówka jest pusta.</li>
    </ul>

    <h3>Dodaj składniki do lodówki</h3>
    <div class="add-ingredient">
      <select v-model="selectedIngredient" class="ingredient-select">
        <option disabled value="">Wybierz składnik</option>
        <option
          v-for="ingredient in filteredAvailableIngredients"
          :key="ingredient.id"
          :value="ingredient.id"
        >
          {{ ingredient.name }}
        </option>
      </select>
      <button class="add-btn" @click="addToFridge" :disabled="!selectedIngredient">Dodaj</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { authFetch } from '../api';

const fridgeIngredients = ref([]);
const availableIngredients = ref([]);
const selectedIngredient = ref('');

// Zbiór ID składników w lodówce
const fridgeIngredientsIds = computed(() => new Set(fridgeIngredients.value.map(i => i.id)));

// Filtrowane składniki do wyboru (te, których nie ma w lodówce)
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
  max-width: 600px;
  margin: 2rem auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 0 1rem;
}

h2, h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.fridge-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.fridge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 10px 15px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: background-color 0.2s ease;
}

.fridge-item:hover {
  background-color: #e1e8f0;
}

.remove-btn {
  background-color: #e74c3c;
  border: none;
  color: white;
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
  transition: background-color 0.2s ease;
}

.remove-btn:hover {
  background-color: #c0392b;
}

.empty-msg {
  font-style: italic;
  color: #777;
  text-align: center;
  margin-bottom: 2rem;
}

.add-ingredient {
  display: flex;
  gap: 10px;
  align-items: center;
}

.ingredient-select {
  flex-grow: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1.5px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.ingredient-select:focus {
  border-color: #42b983;
  outline: none;
}

.add-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.add-btn:not(:disabled):hover {
  background-color: #369b6f;
}
</style>
