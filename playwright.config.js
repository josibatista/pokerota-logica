import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

const porta = process.env.PLAYWRIGHT_PORT || '5174';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${porta}`;

export default defineConfig({
  testDir: './tests',

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL,
    // Overrides opcionais para ambientes com Chromium já instalado/proxy.
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
      proxy: process.env.PLAYWRIGHT_PROXY_SERVER
        ? { server: process.env.PLAYWRIGHT_PROXY_SERVER, bypass: '127.0.0.1,localhost' }
        : undefined,
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: `npm run dev -- --mode test --host 0.0.0.0 --port ${porta} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
