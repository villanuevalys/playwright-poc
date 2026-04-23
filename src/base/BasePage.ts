import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected locator(target: string | Locator): Locator {
    return typeof target === 'string' ? this.page.locator(target) : target;
  }

  async clickElement(target: string | Locator): Promise<void> {
    const locator = this.locator(target);
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  async expectVisible(target: string | Locator, name = 'element'): Promise<void> {
    await expect(this.locator(target), `${name} should be visible`).toBeVisible();
  }

  async fillElement(target: string | Locator, value: string): Promise<void> {
    const locator = this.locator(target);
    await expect(locator).toBeVisible();
    await expect(locator).toBeEditable();
    await locator.fill(value);
  }

  async selectOption(target: string | Locator, value: string): Promise<void> {
    const locator = this.locator(target);
    await expect(locator).toBeVisible();
    await locator.selectOption(value);
  }

  async getText(target: string | Locator): Promise<string> {
    const locator = this.locator(target);
    await expect(locator).toBeVisible();
    return await locator.textContent() || '';
  }

  async expectHaveText(target: string | Locator, text: RegExp | string): Promise<void> {
    await expect(this.locator(target)).toHaveText(text);
  }

  async waitForURL(pattern: RegExp | string): Promise<void> {
    await this.page.waitForURL(pattern);
  }
}
