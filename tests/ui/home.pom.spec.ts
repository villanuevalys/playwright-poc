import { test } from '../../playwright/fixtures';

test.describe('SauceDemo cart and checkout flow', () => {
  test('adds and removes backpack from inventory', async ({ pm, auth }) => {
    const backpackSlug = 'sauce-labs-backpack';
    await auth.loginAsStandardUser();
    await pm.inventoryPage.expectLoaded();

    await pm.inventoryPage.addToCart(backpackSlug);
    await pm.inventoryPage.expectCartBadgeCount(1);
    await pm.inventoryPage.removeFromCart(backpackSlug);
  });

  test('completes checkout for one product', async ({ pm, auth }) => {
    const backpackSlug = 'sauce-labs-backpack';
    await auth.loginAsStandardUser();
    await pm.inventoryPage.expectLoaded();

    await pm.inventoryPage.addToCart(backpackSlug);
    await pm.inventoryPage.openCart();
    await pm.cartPage.expectLoaded();
    await pm.cartPage.expectItemsCount(1);

    await pm.cartPage.goToCheckout();
    await pm.checkoutPage.expectInfoStepLoaded();
    await pm.checkoutPage.fillCustomerInfo('Alex', 'QA', '10001');
    await pm.checkoutPage.continue();
    await pm.checkoutPage.expectOverviewLoaded();
    await pm.checkoutPage.expectTotalVisible();
    await pm.checkoutPage.finish();
    await pm.checkoutPage.expectOrderComplete();
  });
});
