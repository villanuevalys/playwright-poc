import { expect, test } from '../../playwright/fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Product Sorting', () => {
  test('sorts products by name A-Z', { tag: ['@regression', '@inventory', '@sorting'] }, async ({ pm, auth }) => {
    await test.step('Login and load inventory', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });

    await test.step('Sort by name A-Z', async () => {
      await pm.inventoryPage.sortBy('az');
    });

    await test.step('Verify products are sorted A-Z', async () => {
      const names = await pm.inventoryPage.getVisibleProductNames();
      const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(sortedNames);
    });
  });

  test('sorts products by name Z-A', { tag: ['@regression', '@inventory', '@sorting'] }, async ({ pm, auth }) => {
    await test.step('Login and load inventory', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });

    await test.step('Sort by name Z-A', async () => {
      await pm.inventoryPage.sortBy('za');
    });

    await test.step('Verify products are sorted Z-A', async () => {
      const names = await pm.inventoryPage.getVisibleProductNames();
      const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(sortedNames);
    });
  });

  test('sorts products by price low to high', { tag: ['@regression', '@inventory', '@sorting'] }, async ({ pm, auth }) => {
    await test.step('Login and load inventory', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });

    await test.step('Sort by price low to high', async () => {
      await pm.inventoryPage.sortBy('lohi');
    });

    await test.step('Verify products sorted by price ascending', async () => {
      const prices = await pm.inventoryPage.getVisibleProductPrices();
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    });
  });

  test('sorts products by price high to low', { tag: ['@regression', '@inventory', '@sorting'] }, async ({ pm, auth }) => {
    await test.step('Login and load inventory', async () => {
      await auth.loginAsStandardUser();
      await pm.inventoryPage.expectLoaded();
    });

    await test.step('Sort by price high to low', async () => {
      await pm.inventoryPage.sortBy('hilo');
    });

    await test.step('Verify products sorted by price descending', async () => {
      const prices = await pm.inventoryPage.getVisibleProductPrices();
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sortedPrices);
    });
  });
});
