import { expect, test as base } from '@playwright/test';
import { ApiManager } from '../src/api/ApiManager';
import { PageManager } from '../src/ui/PageManager';
import { getRequiredEnv } from '../src/utils/env';

export type AuthFixture = {
  loginAs: (username: string, password: string) => Promise<void>;
  loginAsStandardUser: () => Promise<void>;
  loginAsLockedOutUser: () => Promise<void>;
  loginAsPerformanceUser: () => Promise<void>;
  loginAsProblemUser: () => Promise<void>;
  loginAsInvalidUser: () => Promise<void>;
  loginAsStandardUserWithWrongPassword: () => Promise<void>;
  logout: () => Promise<void>;
};

type Fixtures = {
  pm: PageManager;
  am: ApiManager;
  auth: AuthFixture;
};

type WorkerFixtures = {
  workerId: string;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
  workerId: [
    async ({}, use, workerInfo) => {
      await use(`worker-${workerInfo.workerIndex}`);
    },
    { scope: 'worker' },
  ],
  pm: async ({ page }, use) => {
    await use(new PageManager(page));
  },
  am: async ({ request }, use) => {
    await use(new ApiManager(request));
  },
  // Reusable auth helper fixture for login/logout flows.
  auth: async ({ pm }, use) => {
    const standardUsername = getRequiredEnv('SAUCE_STANDARD_USERNAME');
    const lockedOutUsername = getRequiredEnv('SAUCE_LOCKED_OUT_USERNAME');
    const performanceUsername = getRequiredEnv('SAUCE_PERFORMANCE_USERNAME');
    const problemUsername = getRequiredEnv('SAUCE_PROBLEM_USERNAME');
    const invalidUsername = getRequiredEnv('SAUCE_INVALID_USERNAME');
    const password = getRequiredEnv('SAUCE_PASSWORD');
    const wrongPassword = getRequiredEnv('SAUCE_WRONG_PASSWORD');

    const auth: AuthFixture = {
      async loginAs(username: string, password: string): Promise<void> {
        await pm.loginPage.goto();

        if (!(await pm.loginPage.isLoginFormVisible())) {
          await pm.inventoryPage.logout();
          await pm.loginPage.expectOnLoginPage();
        }

        await pm.loginPage.login(username, password);
      },
      async loginAsStandardUser(): Promise<void> {
        await auth.loginAs(standardUsername, password);
      },
      async loginAsLockedOutUser(): Promise<void> {
        await auth.loginAs(lockedOutUsername, password);
      },
      async loginAsPerformanceUser(): Promise<void> {
        await auth.loginAs(performanceUsername, password);
      },
      async loginAsProblemUser(): Promise<void> {
        await auth.loginAs(problemUsername, password);
      },
      async loginAsInvalidUser(): Promise<void> {
        await auth.loginAs(invalidUsername, password);
      },
      async loginAsStandardUserWithWrongPassword(): Promise<void> {
        await auth.loginAs(standardUsername, wrongPassword);
      },
      async logout(): Promise<void> {
        await pm.inventoryPage.logout();
      },
    };

    await use(auth);
  },
});

export { expect };
