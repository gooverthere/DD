<template>
  <div class="app">
    <aside class="sidebar">
      <nav>
        <ul>
          <li><router-link to="/meals">Posiłki</router-link></li>
          <li><router-link to="/fridge">Lodówka</router-link></li>
          <li><router-link to="/available-meals">Dostępne posiłki</router-link></li>
        </ul>
      </nav>
    </aside>
    <main class="main-view">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Login from './components/Login.vue';
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
}

.app {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 1rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 1rem;
}

.main-view {
  flex: 1;
  padding: 2rem;
}
</style>