<template>
  <div class="app">
    <aside class="sidebar" v-if="$route.path !== '/login'">
      <nav>
        <ul>
          <li><router-link to="/available-meals">Dostępne posiłki</router-link></li>
          <li><router-link to="/fridge">Lodówka</router-link></li>
          <li><router-link to="/meals">Posiłki</router-link></li>
          <li><button class="logout-btn" @click="logout">Wyloguj się</button></li>
        </ul>
      </nav>
    </aside>
    <main class="main-view">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import './assets/styles.css'
import { useRouter } from 'vue-router';
const router = useRouter();

function logout() {
  // Usuń token JWT z localStorage lub innego miejsca
  localStorage.removeItem('token');
  // Przekieruj na stronę logowania
  router.push('/login');
}
</script>

<style>
/* body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  margin: 0;
} */
.app {
  display: flex;
  min-height: 100vh;
  flex-direction: row; /* domyślne, ale warto jawnie dać */
}

.sidebar {
  width: 220px;
  background-color: #2c3e50;
  padding: 1.5rem 1rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  color: #ecf0f1;
  flex-shrink: 0; /* nie pozwala się kurczyć */
}

.main-view {
  flex: 1; /* zajmuje resztę miejsca obok sidebaru */
  padding: 2rem;
  overflow-y: auto; /* jeśli treść jest wysoka, dodaj pasek przewijania */
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 1.2rem;
}

.sidebar li:last-child {
  margin-bottom: 0;
}

.sidebar a {
  color: #bdc3c7;
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.sidebar a:hover {
  background-color: #34495e;
  color: #fff;
}

.router-link-active {
  background-color: var(--primary-color);
  /* background-color: #1abc9c; */
  color: white;
  /* font-weight: bold; */
  font-weight: 600;
}

.logout-btn {
  margin-top: auto;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: #c0392b;
}

</style>