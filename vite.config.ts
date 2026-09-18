import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    watch: {
      // The backend venv is tens of thousands of files; watching it exhausts
      // the inotify watcher limit and makes `npm run dev` crash with ENOSPC.
      ignored: ['**/backend/venv/**', '**/.venv/**', '**/node_modules/**', '**/logs/**'],
    },
    proxy: {
      // Optional same-origin path: fetch('/api/...') avoids CORS entirely.
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
});
