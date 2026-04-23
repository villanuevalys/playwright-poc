import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { homeLocators } from '../locators/homeLocators';

export class HomePage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Playwright/);
    await this.expectVisible(homeLocators.getStartedLink, 'Get started link');
  }

  async goToGetStarted(): Promise<void> {
    await this.clickElement(homeLocators.getStartedLink);
  }

  async expectInstallationHeading(): Promise<void> {
    await this.expectVisible(homeLocators.installationHeading, 'Installation heading');
  }
}
