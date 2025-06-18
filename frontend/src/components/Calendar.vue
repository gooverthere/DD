<template>
  <div class="calendar-container container">
    <h2>Kalendarz posiłków</h2>

    <div class="calendar-controls">
      <label for="date-picker">Wybierz dzień:</label>
      <input id="date-picker" type="date" v-model="selectedDate" @change="fetchCalendarMeals" />
    </div>

    <h3>Twoje posiłki na {{ selectedDate }}</h3>
    <ul class="calendar-meals-list">
      <li v-for="meal in calendarMeals" :key="meal.id" class="calendar-meal-item card">
        <span>{{ meal.name }}</span>
        <button class="remove-btn btn-danger" @click="removeFromCalendar(meal.id)" aria-label="Usuń posiłek">
          &times;
        </button>
      </li>
      <li v-if="calendarMeals.length === 0" class="empty-msg">Brak zaplanowanych posiłków na ten dzień.</li>
    </ul>

    <h3>Dodaj posiłek do kalendarza</h3>
    <div class="add-meal">
      <select v-model="selectedMeal" class="meal-select input">
        <option disabled value="">Wybierz posiłek</option>
        <option v-for="meal in meals" :key="meal.id" :value="meal.id">
          {{ meal.name }}
        </option>
      </select>
      <button class="add-btn btn-primary" @click="addToCalendar" :disabled="!selectedMeal">Dodaj</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authFetch } from '../api';

const calendarMeals = ref([]);
const meals = ref([]);
const selectedMeal = ref('');
const selectedDate = ref(new Date().toISOString().slice(0, 10));

async function fetchCalendarMeals() {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/calendar/${selectedDate.value}`);
  if (res.ok) {
    calendarMeals.value = await res.json();
  }
}

async function fetchAllMeals() {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/meals/list`);
  if (res.ok) {
    meals.value = await res.json();
    console.log('Fetched meals:', meals.value);
  }
}

async function addToCalendar() {
  if (!selectedMeal.value) return;

  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/calendar/${selectedDate.value}/add-meal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mealId: Number(selectedMeal.value),
      date: selectedDate.value,
    }),
  });

  if (res.ok) {
    await fetchCalendarMeals();
    selectedMeal.value = '';
  } else {
    alert('Błąd podczas dodawania posiłku');
  }
}

async function removeFromCalendar(entryId) {
  const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/calendar/entry/${entryId}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    await fetchCalendarMeals();
  } else {
    alert('Błąd podczas usuwania posiłku');
  }
}


onMounted(async () => {
  await fetchAllMeals();
  await fetchCalendarMeals();
});
</script>

<style scoped>
.calendar-container {
  margin: var(--space-xl) auto;
}

h2, h3 {
  color: var(--secondary-color);
  margin-bottom: var(--space-md);
}

.calendar-controls {
  margin-bottom: var(--space-lg);
}

.calendar-meals-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-xl) 0;
}

.calendar-meal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-light);
  padding: var(--space-sm) var(--space-md);
  margin-bottom: var(--space-xs);
  transition: background-color var(--transition-normal);
}

.calendar-meal-item:hover {
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

.add-meal {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.meal-select {
  flex-grow: 1;
  transition: border-color var(--transition-normal);
}

.meal-select:focus {
  border-color: var(--primary-color);
}

.add-btn:disabled {
  background-color: var(--primary-light);
  cursor: not-allowed;
}
</style>
