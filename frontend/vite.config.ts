/// <reference types="vitest" />

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/views/**/*.vue', 'src/components/**/*.vue', 'src/services/**/*.ts'],
      exclude: [
        'src/main.ts',
        'src/router/index.ts',
        'src/tests/**',
        'src/assets/**',
        'src/components/icons/**',
        '**/node_modules/**',
        '**/e2e/**',
        '**/__tests__/**',
        '**/__mocks__/**',
      ],
      all: true,
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})