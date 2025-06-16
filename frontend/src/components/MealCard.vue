<template>
  <div class="meal-card card">
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
  padding: var(--space-md) var(--space-lg);
}

.meal-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.meal-name {
  font-size: 1.3rem;
  margin: 0 0 var(--space-xs);
  color: var(--secondary-color);
  font-weight: 700;
}

.meal-calories {
  font-weight: 600;
  color: var(--success-color);
  margin-bottom: var(--space-sm);
}

.meal-description {
  font-style: italic;
  color: var(--text-light);
  margin-bottom: var(--space-md);
}

.meal-ingredients {
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.3;
}

.meal-ingredients strong {
  color: var(--secondary-color);
}
</style>