import { test } from '../../playwright/fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Product Detail View', () => {
  test('navigates to product detail and displays correct information', { tag: ['@regression', '@inventory', '@product-details'] }, async ({ pm, auth }) => {
    const backpackSlug = 'sauce-labs-backpack';
    const productName = 'Sauce Labs Backpack';
    let expectedProduct: { name: string; description: string; price: string };

    await test.step('Login and load inventory', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });

    await test.step('Capture product details from inventory card', async () => {
      expectedProduct = await pm.inventoryPage.getProductCardDetails(productName);
    });

    await test.step('Navigate to product detail page', async () => {
      await pm.inventoryPage.openProductDetails(productName);
      await pm.productDetailPage.expectLoaded();
    });

    await test.step('Verify product detail displays correctly', async () => {
      await pm.productDetailPage.expectProductInfo(expectedProduct.name, expectedProduct.description, expectedProduct.price);
    });

    await test.step('Add product to cart from detail page', async () => {
      await pm.productDetailPage.addToCart(backpackSlug);
      await pm.inventoryPage.expectCartBadgeCount(1);
    });

    await test.step('Navigate back to products', async () => {
      await pm.productDetailPage.goBackToProducts();
      await pm.inventoryPage.expectLoaded();
    });
  });
});
