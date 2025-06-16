<template>
  <div class="auth-container container card">
    <h2>{{ isRegister ? 'Rejestracja' : 'Logowanie' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="label">Username</label>
        <input v-model="username" class="input" required />
      </div>
      <div class="form-group">
        <label class="label">Password</label>
        <input type="password" v-model="password" class="input" required />
      </div>

      <div v-if="isRegister" class="form-group">
        <label class="label">Confirm Password</label>
        <input type="password" v-model="confirmPassword" class="input" required />
      </div>

      <button type="submit" class="btn btn-primary">
        {{ isRegister ? 'Zarejestruj się' : 'Zaloguj się' }}
      </button>
    </form>

    <p @click="toggleMode" class="toggle-mode">
      {{ isRegister ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się' }}
    </p>

    <p v-if="errorMsg" class="message error">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRegister = ref(false);
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');

function toggleMode() {
  isRegister.value = !isRegister.value;
  errorMsg.value = '';
  username.value = '';
  password.value = '';
  confirmPassword.value = '';
}

async function handleSubmit() {
  errorMsg.value = '';

  if (isRegister.value) {
    if (password.value !== confirmPassword.value) {
      errorMsg.value = 'Hasła muszą być takie same.';
      return;
    }
    // Rejestracja
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value }),
      });
      if (!res.ok) {
        const data = await res.json();
        errorMsg.value = data.message || 'Błąd rejestracji';
        return;
      }
      alert('Rejestracja zakończona sukcesem! Możesz się teraz zalogować.');
      toggleMode();
    } catch (e) {
      errorMsg.value = 'Błąd sieci podczas rejestracji.';
    }
    return;
  } else {
    // Logowanie
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value }),
      });
      if (!res.ok) {
        const data = await res.json();
        errorMsg.value = data.message || 'Błąd logowania';
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/available-meals');
    } catch (e) {
      errorMsg.value = 'Błąd sieci';
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: var(--space-xl) auto;
  padding: var(--space-lg);
}

h2 {
  text-align: center;
  margin-bottom: var(--space-lg);
  color: var(--secondary-color);
}

.form-group {
  margin-bottom: var(--space-md);
}

.btn {
  width: 100%;
  padding: var(--space-md);
  margin-top: var(--space-md);
}

.toggle-mode {
  color: var(--primary-color);
  text-align: center;
  margin-top: var(--space-md);
  cursor: pointer;
  transition: color var(--transition-normal);
}

.toggle-mode:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.message {
  margin-top: var(--space-md);
  text-align: center;
}
</style>