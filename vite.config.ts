import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    // Warning fires on RAW chunk size; our budget is 350 KB *gzipped* per
    // ADR-0001. Raw equivalent comfortably under ~1 MB; 600 KB is a sane
    // intermediate gate that still alerts on real bloat.
    chunkSizeWarningLimit: 600,
  },
});
