import { Page } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

export class PageManager {
  private homePageInstance?: HomePage;
  private loginPageInstance?: LoginPage;
  private inventoryPageInstance?: InventoryPage;
  private cartPageInstance?: CartPage;
  private checkoutPageInstance?: CheckoutPage;
  private productDetailPageInstance?: ProductDetailPage;

  constructor(private readonly page: Page) {}

  get homePage(): HomePage {
    if (!this.homePageInstance) {
      this.homePageInstance = new HomePage(this.page);
    }

    return this.homePageInstance;
  }

  get loginPage(): LoginPage {
    if (!this.loginPageInstance) {
      this.loginPageInstance = new LoginPage(this.page);
    }

    return this.loginPageInstance;
  }

  get inventoryPage(): InventoryPage {
    if (!this.inventoryPageInstance) {
      this.inventoryPageInstance = new InventoryPage(this.page);
    }

    return this.inventoryPageInstance;
  }

  get cartPage(): CartPage {
    if (!this.cartPageInstance) {
      this.cartPageInstance = new CartPage(this.page);
    }

    return this.cartPageInstance;
  }

  get checkoutPage(): CheckoutPage {
    if (!this.checkoutPageInstance) {
      this.checkoutPageInstance = new CheckoutPage(this.page);
    }

    return this.checkoutPageInstance;
  }

  get productDetailPage(): ProductDetailPage {
    if (!this.productDetailPageInstance) {
      this.productDetailPageInstance = new ProductDetailPage(this.page);
    }

    return this.productDetailPageInstance;
  }
}
