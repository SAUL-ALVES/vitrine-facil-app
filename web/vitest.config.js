import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.jsx'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'src/services/**'],
    },
  },
});
