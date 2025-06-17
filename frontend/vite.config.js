import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', 
    port: parseInt(process.env.PORT) || 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/app/src'), // alias @ -> ./src
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});