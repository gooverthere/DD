<template>
  <div class="dashboard">
    <h1>Dashboard Planera Posiłków</h1>
    <p>Witaj! Tu będzie lista Twoich planów posiłków.</p>
    <button @click="logout">Wyloguj się</button>
    <MealList />
    <Fridge />
        <AvailableMeals />

  </div>
</template>

<script setup>
import MealList from './MealList.vue';
import Fridge from './Fridge.vue';
import AvailableMeals from './AvailableMeals.vue';


import { useRouter } from 'vue-router';
const router = useRouter();

function logout() {
  // Tu wyczyść token itp.
  router.push('/');
}
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
}
button {
  padding: 8px 12px;
  background-color: #f56c6c;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #d9534f;
}
</style>
