import { createRouter, createWebHistory } from 'vue-router';
import MealList from '../components/MealList.vue';
import Fridge from '../components/Fridge.vue';
import AvailableMeals from '../components/AvailableMeals.vue';

const routes = [
  { path: '/', redirect: '/available-meals' },
  { path: '/meals', component: MealList },
  { path: '/fridge', component: Fridge },
  { path: '/available-meals', component: AvailableMeals },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;