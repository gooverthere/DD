<template>
  <div class="auth-container">
    <h2>{{ isRegister ? 'Rejestracja' : 'Logowanie' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Username</label>
        <input v-model="username" required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" v-model="password" required />
      </div>

      <div v-if="isRegister">
        <label>Confirm Password</label>
        <input type="password" v-model="confirmPassword" required />
      </div>

      <button type="submit">{{ isRegister ? 'Zarejestruj się' : 'Zaloguj się' }}</button>
    </form>

    <p @click="toggleMode" style="cursor:pointer; color:blue; margin-top: 10px;">
      {{ isRegister ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się' }}
    </p>

    <p v-if="errorMsg" style="color:red;">{{ errorMsg }}</p>
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
    // Rejestracja - tu dodaj endpoint rejestracji, teraz placeholder
    alert(`Rejestracja użytkownika ${username.value} nie jest jeszcze zaimplementowana.`);
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
      alert('Zalogowano pomyślnie! (dalej rozwijamy aplikację)');
      // Tutaj można zapisać token itd.
      localStorage.setItem('token', data.token);

      router.push('/dashboard');

    } catch (e) {
      errorMsg.value = 'Błąd sieci';
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.auth-container form div {
  margin-bottom: 12px;
}
.auth-container label {
  display: block;
  margin-bottom: 4px;
}
.auth-container input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.auth-container button {
  padding: 10px 15px;
  background-color: #42b983;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
.auth-container button:hover {
  background-color: #369b6f;
}
</style>
