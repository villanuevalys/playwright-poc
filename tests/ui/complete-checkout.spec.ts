import { test } from '../../playwright/fixtures';

test.describe('Complete Checkout Process', () => {
  test('completes full checkout flow from product selection to order completion', { tag: ['@smoke', '@regression', '@checkout'] }, async ({ pm, auth }) => {
    const backpackSlug = 'sauce-labs-backpack';
    await test.step('Login as standard user', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });
    
    await test.step('Add product to cart', async () => {
      await pm.inventoryPage.addToCart(backpackSlug);
      await pm.inventoryPage.expectCartBadgeCount(1);
    });
    
    await test.step('Navigate to cart', async () => {
      await pm.inventoryPage.openCart();
      await pm.cartPage.expectLoaded();
      await pm.cartPage.expectItemsCount(1);
    });
    
    await test.step('Proceed to checkout', async () => {
      await pm.cartPage.goToCheckout();
      await pm.checkoutPage.expectInfoStepLoaded();
    });
    
    await test.step('Fill customer info and continue', async () => {
      await pm.checkoutPage.fillCustomerInfo('John', 'Doe', '12345');
      await pm.checkoutPage.continue();
    });
    
    await test.step('Review and complete order', async () => {
      await pm.checkoutPage.expectOverviewLoaded();
      await pm.checkoutPage.expectTotalVisible();
      await pm.checkoutPage.finish();
    });
    
    await test.step('Verify order completion', async () => {
      await pm.checkoutPage.expectOrderComplete();
    });
  });

  test('validates required checkout fields', { tag: ['@regression', '@checkout'] }, async ({ pm, auth }) => {
    const backpackSlug = 'sauce-labs-backpack';
    await test.step('Login and navigate to inventory', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });
    
    await test.step('Add product and proceed to checkout', async () => {
      await pm.inventoryPage.addToCart(backpackSlug);
      await pm.inventoryPage.openCart();
      await pm.cartPage.goToCheckout();
      await pm.checkoutPage.expectInfoStepLoaded();
    });
    
    await test.step('Verify validation error for missing fields', async () => {
      await pm.checkoutPage.continue();
      await pm.checkoutPage.expectValidationError(/First Name is required/);
    });
  });
});