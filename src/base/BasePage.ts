import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async clickElement(selector: string): Promise<void> {
    const locator = this.locator(selector);
    await locator.waitFor({ state: 'visible' });
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  async expectVisible(selector: string, name = selector): Promise<void> {
    await expect(this.locator(selector), `${name} should be visible`).toBeVisible();
  }

  async fillElement(selector: string, value: string): Promise<void> {
    const locator = this.locator(selector);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async selectOption(selector: string, value: string): Promise<void> {
    const locator = this.locator(selector);
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async getText(selector: string): Promise<string> {
    const locator = this.locator(selector);
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  async expectHaveText(selector: string, text: RegExp | string): Promise<void> {
    await expect(this.locator(selector)).toHaveText(text);
  }

  async waitForURL(pattern: RegExp | string): Promise<void> {
    await this.page.waitForURL(pattern);
  }
}
