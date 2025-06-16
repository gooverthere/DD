<template>
  <div>
    <h2>Lista posiłków</h2>
    <div v-if="meals.length" class="meals-grid">
      <MealCard v-for="meal in meals" :key="meal.id" :meal="meal" />
    </div>
    <p v-else>Brak posiłków do wyświetlenia.</p>

    <button class="btn-primary" @click="showModal = true">Dodaj nowy posiłek</button>

    <div v-if="message" :class="['message', messageColor === 'red' ? 'error' : 'success']" style="margin-top: 1rem;">
      {{ message }}
    </div>

    <MealFormModal
      v-model="showModal"
      @meal-added="handleMealAdded"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MealCard from './MealCard.vue';
import MealFormModal from './MealFormModal.vue';
import { authFetch } from '../api';

const meals = ref([]);
const message = ref('');
const messageColor = ref('green');
const showModal = ref(false);

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

function handleMealAdded() {
  message.value = 'Posiłek dodany pomyślnie!';
  messageColor.value = 'green';
  loadMeals();
}

onMounted(() => {
  loadMeals();
});
</script>

<style scoped>
.meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #27ae60;
  border: none;
  color: white;
  padding: 0.5rem 1.3rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #1e8449;
}

.message {
  font-weight: 600;
}

.message.error {
  color: #e74c3c;
}

.message.success {
  color: #27ae60;
}
</style>
