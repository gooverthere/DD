<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <button type="submit">Log In</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + '/api/auth/login',
      { username: username.value, password: password.value }
    );
    alert(response.data.message);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Login failed';
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
