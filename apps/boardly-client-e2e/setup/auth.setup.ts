import { test as setup } from '@playwright/test';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { setupUserAuthMocks } from '../mocks/api.mock';

const authFile = path.join(
  dirname(fileURLToPath(import.meta.url)),
  '../playwright/.auth/user.json'
);

setup('authenticate', async ({ page }) => {
  await page.goto('/');

  await setupUserAuthMocks(await page.context());

  await page.locator('#email').fill('test@gmail.com');
  await page.locator('#password').fill('123123');

  await page
    .locator('.sign-in-container')
    .getByRole('button', { name: 'Sign In' })
    .click();

  await page.waitForURL(/.*\/boards/);

  await page.context().storageState({ path: authFile });
});
