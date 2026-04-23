import { test } from '../../playwright/fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication - Invalid Login', () => {
  test('shows error for invalid username', { tag: ['@smoke', '@regression', '@auth'] }, async ({ pm, auth }) => {
    await auth.loginAsInvalidUser();

    await pm.loginPage.expectOnLoginPage();
    await pm.loginPage.expectLoginError(/Username and password do not match/);
  });

  test('shows error for invalid password', { tag: ['@regression', '@auth'] }, async ({ pm, auth }) => {
    await auth.loginAsStandardUserWithWrongPassword();

    await pm.loginPage.expectOnLoginPage();
    await pm.loginPage.expectLoginError(/Username and password do not match/);
  });

  test('shows error for empty credentials', { tag: ['@regression', '@auth'] }, async ({ pm, auth }) => {
    await auth.loginAs('', '');

    await pm.loginPage.expectOnLoginPage();
    await pm.loginPage.expectLoginError(/Username is required/);
  });
});