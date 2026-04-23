import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { loginLocators } from '../locators/loginLocators';

export class LoginPage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.page.locator(loginLocators.username).isVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.locator(loginLocators.username).fill(username);
    await this.locator(loginLocators.password).fill(password);
    await this.clickElement(loginLocators.loginButton);
  }

  async expectLoginError(message: RegExp | string): Promise<void> {
    await expect(this.locator(loginLocators.errorMessage)).toHaveText(message);
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
    await this.expectVisible(loginLocators.loginButton, 'Login button');
  }
}
