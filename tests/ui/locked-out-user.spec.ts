import { test } from '../../playwright/fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication - Locked Out User', () => {
  test('blocks locked out user from logging in', { tag: ['@smoke', '@regression', '@auth'] }, async ({ pm, auth }) => {
    await auth.loginAsLockedOutUser();
    
    // Should remain on login page
    await pm.loginPage.expectOnLoginPage();
    
    // Should show locked out error message
    await pm.loginPage.expectLoginError(/Sorry, this user has been locked out/);
  });
});