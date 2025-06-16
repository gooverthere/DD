<template>
  <div class="meal-card">
    <h3 class="meal-name">{{ meal.name }}</h3>
    <p class="meal-calories">{{ meal.calories ?? 'brak kcal' }} kcal</p>
    <p class="meal-description" v-if="meal.description">{{ meal.description }}</p>
    <p class="meal-ingredients">
      <strong>Składniki:</strong>
      <span v-if="meal.ingredients.length">
        {{ meal.ingredients.map(i => i.name).join(', ') }}
      </span>
      <span v-else>Brak</span>
    </p>
  </div>
</template>

<script setup>
defineProps({
  meal: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.meal-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.meal-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.meal-name {
  font-size: 1.3rem;
  margin: 0 0 0.25rem;
  color: #2c3e50;
  font-weight: 700;
}

.meal-calories {
  font-weight: 600;
  color: #27ae60;
  margin-bottom: 0.75rem;
}

.meal-description {
  font-style: italic;
  color: #555;
  margin-bottom: 1rem;
}

.meal-ingredients {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.3;
}

.meal-ingredients strong {
  color: #2c3e50;
}
</style>
