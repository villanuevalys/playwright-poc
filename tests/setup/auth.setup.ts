import fs from 'fs/promises';
import path from 'path';
import { expect, test as setup } from '@playwright/test';
import { getRequiredEnv } from '../../src/utils/env';

setup('authenticate standard user', async ({ page }) => {
  const username = getRequiredEnv('SAUCE_STANDARD_USERNAME');
  const password = getRequiredEnv('SAUCE_PASSWORD');
  const authPath = path.resolve(__dirname, '../../playwright/.auth/standard-user.json');

  await fs.mkdir(path.dirname(authPath), { recursive: true });
  await page.goto('/');
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await page.context().storageState({ path: authPath });
});
