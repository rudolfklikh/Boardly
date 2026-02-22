import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

export default defineConfig({
  ...nxE2EPreset(dirname(fileURLToPath(import.meta.url)), { testDir: './e2e' }),
  timeout: 30 * 1000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  expect: {
    timeout: 5000
  },
  use: {
    baseURL,
    actionTimeout: 0,
    trace: 'on-first-retry',
    headless: true
  },
  webServer: {
    command: 'nx serve boardly-client',
    port: 4200,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/, testDir: './setup' },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(
          dirname(fileURLToPath(import.meta.url)),
          './playwright/.auth/user.json'
        )
      },
      dependencies: ['setup']
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: path.join(
          dirname(fileURLToPath(import.meta.url)),
          './playwright/.auth/user.json'
        )
      },
      dependencies: ['setup']
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: path.join(
          dirname(fileURLToPath(import.meta.url)),
          './playwright/.auth/user.json'
        )
      },
      dependencies: ['setup']
    }
  ]
});
