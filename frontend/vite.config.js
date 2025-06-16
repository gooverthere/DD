import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import dotenv from 'dotenv';

// dotenv.config();

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // ważne w Dockerze
    port: parseInt(process.env.PORT) || 3000
  }
});