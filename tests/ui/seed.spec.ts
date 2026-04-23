import { test } from '../../playwright/fixtures';

test.describe('Seed setup', () => {
  test('seed deterministic SauceDemo state', { tag: ['@regression', '@setup'] }, async ({ pm, auth }) => {
    await auth.loginAsStandardUser();
    await pm.inventoryPage.expectLoaded();

    await pm.inventoryPage.resetAppState();
    await pm.inventoryPage.openCart();
    await pm.cartPage.expectLoaded();
    await pm.cartPage.expectItemsCount(0);
  });
});
