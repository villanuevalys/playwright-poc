import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { inventoryLocators } from '../locators/inventoryLocators';

export class InventoryPage extends BasePage {
  async getVisibleProductNames(): Promise<string[]> {
    const names = await this.page.locator(inventoryLocators.productName).allInnerTexts();
    return names.map((name) => name.trim());
  }

  async getVisibleProductPrices(): Promise<number[]> {
    const prices = await this.page.locator(inventoryLocators.productPrice).allInnerTexts();
    return prices.map((price) => Number.parseFloat(price.replace('$', '').trim()));
  }

  async getProductCardDetails(productName: string): Promise<{ name: string; description: string; price: string }> {
    const card = this.page
      .locator(inventoryLocators.productItems)
      .filter({ has: this.page.locator(inventoryLocators.productName, { hasText: productName }) })
      .first();

    return {
      name: (await card.locator(inventoryLocators.productName).innerText()).trim(),
      description: (await card.locator(inventoryLocators.productDescription).innerText()).trim(),
      price: (await card.locator(inventoryLocators.productPrice).innerText()).trim(),
    };
  }

  async openProductDetails(productName: string): Promise<void> {
    await this.page.locator(inventoryLocators.productName, { hasText: productName }).first().click();
  }

  async addToCart(slug: string): Promise<void> {
    await this.clickElement(inventoryLocators.addToCartButton(slug));
  }

  async removeFromCart(slug: string): Promise<void> {
    await this.clickElement(inventoryLocators.removeButton(slug));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await this.expectVisible(inventoryLocators.pageTitle, 'Inventory title');
    await expect(this.page.locator(inventoryLocators.productItems)).toHaveCount(6);
  }

  async openCart(): Promise<void> {
    await this.clickElement(inventoryLocators.cartLink);
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    await expect(this.page.locator(inventoryLocators.cartBadge)).toHaveText(String(count));
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.selectOption(inventoryLocators.sortDropdown, value);
  }

  async openMenu(): Promise<void> {
    const resetLink = this.page.locator(inventoryLocators.resetAppStateLink);
    await this.clickElement(inventoryLocators.burgerMenu);
    await expect(resetLink).toBeVisible();
    await expect(resetLink).toBeInViewport();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    const logoutLink = this.page.locator(inventoryLocators.logoutLink);
    await expect(logoutLink).toBeVisible();
    await logoutLink.scrollIntoViewIfNeeded();
    await logoutLink.click({ force: true });
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    const resetLink = this.page.locator(inventoryLocators.resetAppStateLink);
    await expect(resetLink).toBeVisible();
    await resetLink.scrollIntoViewIfNeeded();
    await resetLink.click({ force: true });
  }
}
