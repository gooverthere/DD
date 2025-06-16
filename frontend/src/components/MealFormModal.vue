<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h2>Dodaj nowy posiłek</h2>
      <form @submit.prevent="submitForm" class="form-popup">
        <label for="name">Nazwa:</label>
        <input id="name" v-model="name" required autocomplete="off" autofocus />

        <label for="description">Opis:</label>
        <textarea id="description" v-model="description" rows="3"></textarea>

        <label for="calories">Kalorie:</label>
        <input
          id="calories"
          type="number"
          v-model.number="calories"
          min="0"
          required
          autocomplete="off"
        />

        <label>Składniki:</label>
        <div v-if="ingredients.length === 0">Ładowanie składników...</div>
        <div v-else class="ingredients-list">
          <label v-for="ingredient in ingredients" :key="ingredient.id" class="ingredient-checkbox">
            <input
              type="checkbox"
              :value="ingredient.id"
              v-model="selectedIngredients"
            />
            {{ ingredient.name }}
          </label>
        </div>

        <div class="modal-buttons">
          <button
            type="submit"
            :disabled="!name || selectedIngredients.length === 0"
            class="btn-primary"
          >
            Dodaj posiłek
          </button>
          <button type="button" @click="closeModal" class="btn-secondary">Anuluj</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { authFetch } from '../api';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'meal-added']);

const name = ref('');
const description = ref('');
const calories = ref(null);
const ingredients = ref([]);
const selectedIngredients = ref([]);
const message = ref('');
const messageColor = ref('green');

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

function resetForm() {
  name.value = '';
  description.value = '';
  calories.value = null;
  selectedIngredients.value = [];
  message.value = '';
  messageColor.value = 'green';
}

// resetuj formularz, gdy modal się otwiera
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) resetForm();
  }
);

function closeModal() {
  emit('update:modelValue', false);
}

async function submitForm() {
  message.value = '';
  const payload = {
    name: name.value.trim(),
    description: description.value.trim(),
    calories: calories.value,
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

    emit('meal-added');
    closeModal();
  } catch (e) {
    message.value = e.message;
    messageColor.value = 'red';
  }
}

onMounted(() => {
  loadIngredients();
});
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  position: relative;
}

.form-popup label {
  display: block;
  margin-top: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-popup input[type="text"],
.form-popup input[type="number"],
.form-popup textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.ingredients-list {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #fafafa;
  margin-top: 0.3rem;
}

.ingredient-checkbox {
  display: block;
  margin-bottom: 0.4rem;
  cursor: pointer;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
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

.btn-primary:disabled {
  background-color: #a7d7a9;
  cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1e8449;
}

.btn-secondary {
  background-color: #ccc;
  border: none;
  padding: 0.5rem 1.3rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-secondary:hover {
  background-color: #999;
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
