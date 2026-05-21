import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Stub the vite-plugin-pwa virtual module so tests don't need the plugin.
      'virtual:pwa-register': resolve(
        __dirname,
        'tests/stubs/virtual-pwa-register.ts'
      ),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: true,
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'tests/unit/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'storybook-static/',
      'tests/e2e/**',
      '**/*.stories.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/setup.ts',
        '**/*.config.{ts,js}',
        '**/*.d.ts',
        'storybook-static/',
        '.storybook/',
      ],
    },
  },
});
