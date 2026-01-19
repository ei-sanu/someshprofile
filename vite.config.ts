import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { payuCallbackPlugin } from './vite-payu-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), payuCallbackPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {},
  },
  preview: {
    port: 5173,
  },
});
