import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { cartLocators } from '../locators/cartLocators';

export class CartPage extends BasePage {
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/cart\.html$/);
    await this.expectVisible(cartLocators.checkoutButton, 'Checkout button');
  }

  async expectItemsCount(count: number): Promise<void> {
    await expect(this.page.locator(cartLocators.cartItems)).toHaveCount(count);
  }

  async removeItem(slug: string): Promise<void> {
    await this.clickElement(cartLocators.removeButton(slug));
  }

  async goToCheckout(): Promise<void> {
    await this.clickElement(cartLocators.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.clickElement(cartLocators.continueShoppingButton);
  }
}
