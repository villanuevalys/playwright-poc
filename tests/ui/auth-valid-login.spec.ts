import { test } from '../../playwright/fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication - Valid Login', () => {
  test('logs in successfully with standard user', { tag: ['@smoke', '@regression', '@auth'] }, async ({ pm, auth }) => {
    await auth.loginAsStandardUser();
    
    // Verify user is redirected to inventory page and products are displayed
    await pm.inventoryPage.expectLoaded();
  });

  test('logs in successfully with performance glitch user', { tag: ['@regression', '@auth'] }, async ({ pm, auth }) => {
    await auth.loginAsPerformanceUser();
    
    // Should still work but may be slower
    await pm.inventoryPage.expectLoaded();
  });

  test('logs in successfully with problem user', { tag: ['@regression', '@auth'] }, async ({ pm, auth }) => {
    await auth.loginAsProblemUser();
    
    await pm.inventoryPage.expectLoaded();
  });
});