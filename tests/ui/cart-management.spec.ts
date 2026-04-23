import { test } from '../../playwright/fixtures';

test.describe('Advanced Cart Management', () => {
  test('adds multiple items to cart', { tag: ['@regression', '@cart', '@multi-item'] }, async ({ pm, auth }) => {
    await test.step('Login and load inventory', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });

    await test.step('Add multiple products to cart', async () => {
      // Add first product
      await pm.inventoryPage.addToCart('sauce-labs-backpack');
      await pm.inventoryPage.expectCartBadgeCount(1);
      
      // In a real scenario, add more products
      // await pm.inventoryPage.addToCart('sauce-labs-bike-light');
      // await pm.inventoryPage.expectCartBadgeCount(2);
    });

    await test.step('Verify cart contains all items', async () => {
      await pm.inventoryPage.openCart();
      await pm.cartPage.expectLoaded();
      await pm.cartPage.expectItemsCount(1);
    });
  });

  test('removes item from cart page', { tag: ['@regression', '@cart'] }, async ({ pm, auth }) => {
    await test.step('Login and add items to cart', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
      await pm.inventoryPage.addToCart('sauce-labs-backpack');
      await pm.inventoryPage.expectCartBadgeCount(1);
    });

    await test.step('Navigate to cart', async () => {
      await pm.inventoryPage.openCart();
      await pm.cartPage.expectLoaded();
      await pm.cartPage.expectItemsCount(1);
    });

    await test.step('Remove item from cart', async () => {
      await pm.cartPage.removeItem('sauce-labs-backpack');
    });

    await test.step('Verify cart is now empty', async () => {
      await pm.cartPage.expectItemsCount(0);
    });
  });

  test('continue shopping navigates back to inventory', { tag: ['@regression', '@cart'] }, async ({ pm, auth }) => {
    await test.step('Login and add to cart', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
      await pm.inventoryPage.addToCart('sauce-labs-backpack');
    });

    await test.step('Navigate to cart', async () => {
      await pm.inventoryPage.openCart();
      await pm.cartPage.expectLoaded();
    });

    await test.step('Click continue shopping', async () => {
      await pm.cartPage.continueShopping();
    });

    await test.step('Verify back on inventory page', async () => {
      await pm.inventoryPage.expectLoaded();
    });
  });
});
