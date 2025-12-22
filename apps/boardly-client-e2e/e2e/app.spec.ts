import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';

test('should show empty boards page', async ({ userPage }) => {
  await userPage.goto('/boards');

  await expect(userPage.locator('.boards-empty')).toContainText(
    `You don't have any new boards`
  );
});
