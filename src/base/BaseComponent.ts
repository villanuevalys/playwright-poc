import { Locator } from '@playwright/test';

export abstract class BaseComponent {
  constructor(protected readonly root: Locator) {}

  protected byRole(role: Parameters<Locator['getByRole']>[0], options?: Parameters<Locator['getByRole']>[1]): Locator {
    return this.root.getByRole(role, options);
  }
}
