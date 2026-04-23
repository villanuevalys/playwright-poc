import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { productLocators } from '../locators/productLocators';

export class ProductDetailPage extends BasePage {
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/inventory-item\\.html\\?id=.*`));
    await this.expectVisible(productLocators.productImage, 'Product image');
    await this.expectVisible(productLocators.productName, 'Product name');
    await this.expectVisible(productLocators.productPrice, 'Product price');
  }

  async expectProductInfo(name: string, description: string, price: string): Promise<void> {
    await this.expectHaveText(productLocators.productName, name);
    await this.expectHaveText(productLocators.productDescription, description);
    await this.expectHaveText(productLocators.productPrice, price);
  }

  async addToCart(): Promise<void> {
    const addToCartButton = this.page.getByRole('button', { name: /^Add to cart$/i });
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
  }

  async goBackToProducts(): Promise<void> {
    await this.clickElement(productLocators.backButton);
  }
}
