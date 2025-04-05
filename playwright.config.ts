import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Global settings
  testDir: './src/tests',
  timeout: 30000, // Global timeout of 30 seconds
  workers: process.env.CI ? 1 : undefined, // Use max workers locally, 1 in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests twice in CI
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'] // Add list reporter for better CI output
  ],

  // Configure projects for parallel execution
  projects: [
    {
      name: 'api-tests',
      testMatch: /.*api\.spec\.ts/,
      workers: 3, // Run API tests with 3 workers
    },
    {
      name: 'chromium', // Changed from 'chrome' to 'chromium'
      testMatch: /.*example\.spec\.ts/,
      use: {
        browserName: 'chromium',
        // Removed channel: 'chrome' to use default Chromium
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'firefox',
      testMatch: /.*example\.spec\.ts/,
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'webkit',
      testMatch: /.*example\.spec\.ts/,
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'mobile-chrome',
      testMatch: /.*example\.spec\.ts/,
      use: {
        browserName: 'chromium',
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      testMatch: /.*example\.spec\.ts/,
      use: {
        browserName: 'webkit',
        ...devices['iPhone 12'],
      },
    },
  ],

  // Use a separate directory for each worker's outputs
  outputDir: 'test-results',

  // Global setup and teardown
  globalSetup: require.resolve('./src/config/global-setup.ts'),
  globalTeardown: require.resolve('./src/config/global-teardown.ts'),
});