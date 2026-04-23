import { test } from '../../playwright/fixtures';

test.describe('Inventory and Cart Management', () => {
  test('adds product to cart and verifies cart contents', { tag: ['@smoke', '@regression', '@cart'] }, async ({ pm, auth }) => {
    const backpackSlug = 'sauce-labs-backpack';
    await test.step('Login and verify inventory loaded', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });
    
    await test.step('Add product to cart', async () => {
      await pm.inventoryPage.addToCart(backpackSlug);
      await pm.inventoryPage.expectCartBadgeCount(1);
    });
    
    await test.step('Navigate to cart and verify contents', async () => {
      await pm.inventoryPage.openCart();
      await pm.cartPage.expectLoaded();
      await pm.cartPage.expectItemsCount(1);
    });
  });

  test('removes product from cart', { tag: ['@regression', '@cart'] }, async ({ pm, auth }) => {
    const backpackSlug = 'sauce-labs-backpack';
    await test.step('Login and verify inventory loaded', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });
    
    await test.step('Add and then remove product', async () => {
      await pm.inventoryPage.addToCart(backpackSlug);
      await pm.inventoryPage.expectCartBadgeCount(1);
      await pm.inventoryPage.removeFromCart(backpackSlug);
    });
    
    await test.step('Navigate to cart and verify empty', async () => {
      await pm.inventoryPage.openCart();
      await pm.cartPage.expectItemsCount(0);
    });
  });
});