import { createRouter, createWebHistory } from 'vue-router';
import MealList from '../components/MealList.vue';
import Fridge from '../components/Fridge.vue';
import AvailableMeals from '../components/AvailableMeals.vue';
import Login from '../components/Login.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/meals', component: MealList },
  { path: '/fridge', component: Fridge },
  { path: '/available-meals', component: AvailableMeals },
  { path: '/:pathMatch(.*)*', redirect: '/login' }, // przekierowanie na login dla innych ścieżek
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    // brak tokena i strona wymaga autoryzacji -> przekieruj na login
    return next('/login');
  }

  if (to.path === '/login' && token) {
    // jeśli użytkownik jest zalogowany i próbuje wejść na login, przekieruj na dashboard
    return next('/available-meals');
  }

  next();
});

export default router;