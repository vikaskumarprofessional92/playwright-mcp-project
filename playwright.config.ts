import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    channel: 'chrome',
    headless: true
  },
  testDir: './src/tests',
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  workers: 2
});