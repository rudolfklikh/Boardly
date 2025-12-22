import { test as base, type Page } from '@playwright/test';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { setupUserAuthMocks } from '../mocks/api.mock';

interface MyFixtures {
  userPage: Page;
}

export const test = base.extend<MyFixtures>({
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(
        dirname(fileURLToPath(import.meta.url)),
        '../playwright/.auth/user.json'
      )
    });

    await setupUserAuthMocks(context);

    await use(await context.newPage());

    await context.close();
  }
});
