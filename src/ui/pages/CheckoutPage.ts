import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { checkoutLocators } from '../locators/checkoutLocators';

export class CheckoutPage extends BasePage {
  async expectInfoStepLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
    await this.expectVisible(checkoutLocators.continueButton, 'Continue button');
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillElement(checkoutLocators.firstName, firstName);
    await this.fillElement(checkoutLocators.lastName, lastName);
    await this.fillElement(checkoutLocators.postalCode, postalCode);
  }

  async continue(): Promise<void> {
    await this.clickElement(checkoutLocators.continueButton);
  }

  async finish(): Promise<void> {
    await this.clickElement(checkoutLocators.finishButton);
  }

  async expectOverviewLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
    await this.expectVisible(checkoutLocators.finishButton, 'Finish button');
  }

  async expectValidationError(message: RegExp | string): Promise<void> {
    await this.expectHaveText(checkoutLocators.errorMessage, message);
  }

  async expectTotalVisible(): Promise<void> {
    await this.expectVisible(checkoutLocators.summaryTotal, 'Summary total');
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(this.page.locator(checkoutLocators.completeHeader)).toHaveText('Thank you for your order!');
  }
}
