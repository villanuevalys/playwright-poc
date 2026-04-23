This document provides the complete blueprint, installation guide, and core setup for a **Scalable Hybrid-POM** automation framework.

---

## 🏗️ 1. Project Structure

```text
root/
├── playwright/                 # FRAMEWORK EXTENSIONS
│   └── fixtures.ts             # Custom test extension (Injects { pm, am })
├── src/                        # THE CORE ENGINE (Business Logic)
│   ├── base/                   # THE FOUNDATION
│   │   ├── BasePage.ts         # Global UI wrappers (Standardized Actions)
│   │   ├── BaseComponent.ts    # Scoped "Root" locator logic
│   │   └── BaseController.ts   # Global API wrappers
│   ├── ui/                     # UI LAYER
│   │   ├── PageManager.ts      # UI Hub (Lazy-loads Page Objects)
│   │   ├── pages/              # Screen-specific logic (name+Page.ts)
│   │   ├── components/         # Reusable UI units (name+Component.ts)
│   │   └── locators/           # Centralized selector constants (name+Locators.ts)
│   ├── api/                    # API LAYER
│   │   ├── ApiManager.ts       # API Hub (Lazy-loads Controllers)
│   │   ├── controllers/        # Service-specific logic (name+Controller.ts)
│   │   └── models/             # TS Interfaces for payloads (name+Interface.ts)
│   └── utils/                  # SHARED HELPERS (Logger, Database, Parsers)
├── tests/                      # THE SPECS (Test Scenarios)
│   ├── ui/                     # Pure UI functional tests
│   ├── api/                    # Pure API/Backend tests
│   └── hybrid/                 # Speed-optimized (API Setup + UI Verify)
├── playwright.config.ts        # Main Playwright Configuration
├── tsconfig.json               # TypeScript Compiler Settings
└── .env                        # Secrets and Credentials (GitIgnored)
```

## ✅ 2. Framework Quality & Compliance

This framework implements **Playwright best practices** validated against official documentation.

### Architecture Strengths
- ✅ **Custom Fixture Pattern** — Uses `test.extend<Fixtures, WorkerFixtures>` matching Playwright docs exactly
- ✅ **Page Object Model** — PageManager with lazy-loaded page instances for scalability
- ✅ **Web-First Assertions** — BasePage enforces `expect().toBeVisible()` before actions (prevents flakiness)
- ✅ **Test Isolation** — Setup project → auth state → browser projects with dependencies
- ✅ **Parallel Safety** — Worker-scoped `workerId` fixture prevents data conflicts
- ✅ **Multi-Browser** — Chromium, Firefox, WebKit with shared storageState
- ✅ **CI/Dev Split** — Optimized execution strategies (retries, workers, reporters)
- ✅ **TypeScript** — Full type safety for fixtures, pages, and controllers

### Why This Architecture Works
- **Maintainability:** Centralized selectors in `/locators`, business logic in `/pages`, reducing duplication
- **Reliability:** Web-first assertions + trace/video retention catch intermittent failures
- **Scalability:** Lazy-loaded managers allow adding new pages/controllers without refactoring
- **CI Performance:** Setup project dependency + storageState eliminates redundant auth runs across test suites

---

## 🛠️ 3. Installation & Environment Setup

### Step 1: Prerequisites

- Node.js LTS (18+ recommended)
- npm 9+
- Git

### Step 2: Install dependencies

```bash
npm ci
```

### Step 3: Install Playwright browsers

```bash
npx playwright install --with-deps
```

### Step 4: Configure environment variables

Create a `.env` file in repository root:

```env
SAUCE_STANDARD_USERNAME=standard_user
SAUCE_LOCKED_OUT_USERNAME=locked_out_user
SAUCE_PERFORMANCE_USERNAME=performance_glitch_user
SAUCE_PROBLEM_USERNAME=problem_user
SAUCE_INVALID_USERNAME=invalid_user
SAUCE_PASSWORD=secret_sauce
SAUCE_WRONG_PASSWORD=wrong_password
```

### Step 5: Validate setup

```bash
npm run typecheck
npm run test:list
npm run test:ci
```

## ⚙️ 4. Core Framework Setup

### The Base Page Class (src/base/BasePage.ts)

```ts
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
}
```

### The Custom Fixtures (playwright/fixtures.ts)

The custom test object provides **page-scoped** fixtures (pm, am, auth) and **worker-scoped** fixtures (workerId).

```ts
import { test as base, expect } from '@playwright/test';
import { PageManager } from '../src/ui/PageManager';
import { ApiManager } from '../src/api/ApiManager';

type Fixtures = {
  pm: PageManager;              // Page-scoped: fresh per test
  am: ApiManager;               // Page-scoped: fresh per test
  auth: AuthFixture;            // Page-scoped: login/logout helpers
};

type WorkerFixtures = {
  workerId: string;             // Worker-scoped: unique per parallel worker
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
  auth: async ({ pm }, use) => {
    await use({
      loginAs: (username, password) => pm.loginPage.login(username, password),
      loginAsStandardUser: () => pm.loginPage.login(process.env.SAUCE_STANDARD_USERNAME!, process.env.SAUCE_PASSWORD!),
      loginAsLockedOutUser: () => pm.loginPage.login(process.env.SAUCE_LOCKED_OUT_USERNAME!, process.env.SAUCE_PASSWORD!),
      logout: () => pm.loginPage.logout(),
    });
  },
});

export { expect };
```

#### Fixture Scopes
- **Page-scoped** (pm, am, auth): Fresh instance per test → full isolation, no state leakage
- **Worker-scoped** (workerId): Shared across tests in same worker → used for unique data generation per parallel worker

#### Auth Fixture Usage

```ts
import { test } from '../../playwright/fixtures';

test('logout and re-login', async ({ auth, pm }) => {
  await auth.loginAsStandardUser();           // Pre-authenticated via setup
  await pm.inventoryPage.expectLoaded();
  await auth.logout();
  await pm.loginPage.expectLoaded();          // Back at login page
  await auth.loginAsLockedOutUser();
  await pm.loginPage.expectErrorVisible();    // Locked out error
});
```

#### WorkerId for Parallel-Safe Data

```ts
import { test } from '../../playwright/fixtures';

test('unique checkout per worker', async ({ workerId, pm }) => {
  const customerData = {
    firstName: `User-${workerId}`,  // e.g., "User-worker-0", "User-worker-1"
    lastName: 'TestAccount',
  };
  await pm.checkoutPage.fillCustomerInfo(customerData);
});
```

## 🚀 5. Usage

### Clean Imports

Use the custom fixtures for all project tests:

```ts
import { test, expect } from '../../playwright/fixtures';
```

### Execution

Run full suite:

```bash
npm run test
```

Run CI scope (api + chromium):

```bash
npm run test:ci
```

List tests:

```bash
npm run test:list
```

Run in UI mode:

```bash
npm run test:ui
```

Run headed:

```bash
npm run test:headed
```

Run debug mode:

```bash
npm run test:debug
```

Show report:

```bash
npm run report
```

## 📚 6. Best Practices

### Web-First Assertions
Always verify element state before interaction. This prevents flaky tests from hidden/disabled elements:

```ts
// ✅ Good: BasePage enforces this
async clickElement(target: string | Locator): Promise<void> {
  const locator = this.locator(target);
  await expect(locator).toBeVisible();    // Waits up to 8s with exponential backoff
  await expect(locator).toBeEnabled();    // Ensures element is clickable
  await locator.click();
}

// ❌ Bad: skips validation
await locator.click();  // May fail if hidden or disabled
```

### Locator Strategy
Centralize selectors in `/locators` files, never hardcode:

```ts
// ✅ Good: locators/loginLocators.ts
export const LOGIN_LOCATORS = {
  usernameInput: '[data-test="username"]',
  passwordInput: '[data-test="password"]',
  submitButton: 'button[type="submit"]',
};

// ✅ Usage in page
async login(username: string, password: string): Promise<void> {
  await this.fillElement(LOGIN_LOCATORS.usernameInput, username);
  await this.fillElement(LOGIN_LOCATORS.passwordInput, password);
  await this.clickElement(LOGIN_LOCATORS.submitButton);
}
```

### Test Isolation with Tags
Use test tags for selective execution and filtering:

```ts
test('valid login flow', { tag: ['@smoke', '@regression', '@auth'] }, async ({ auth, pm }) => {
  await auth.loginAsStandardUser();
  await pm.inventoryPage.expectLoaded();
});

// Run smoke tests only
// npx playwright test --grep @smoke

// Run everything except auth tests
// npx playwright test --grep-invert @auth
```

### Parallel Safety with WorkerId
When tests run in parallel, use `workerId` to ensure unique data:

```ts
test('complete checkout', async ({ workerId, pm, auth }) => {
  await auth.loginAsStandardUser();
  const uniqueEmail = `test+${workerId}@example.com`;
  await pm.checkoutPage.fillEmail(uniqueEmail);
  // Each worker gets unique email, prevents conflicts
});
```

### Error Context in Assertions
Provide descriptive error messages for debugging:

```ts
// ✅ Good
await expect(this.page.locator('[data-test="submit"]'), 
  'Submit button should be visible to complete form').toBeVisible();

// ❌ Generic
await expect(this.page.locator('[data-test="submit"]')).toBeVisible();
```

---

## ✅ 7. Recommended First Run

```bash
npm ci
npx playwright install --with-deps
npm run typecheck
npm run test:ci
```

## 🔎 8. Troubleshooting

### Missing required environment variable

Cause: `.env` is missing or a required `SAUCE_*` value is not defined.

Fix:

1. Verify `.env` exists at project root.
2. Verify all required keys are present.

### Auth/setup issues

Cause: stale storage state in `playwright/.auth/`.

Fix:

1. Delete `playwright/.auth/standard-user.json`.
2. Re-run `npm run test:ci`.

### Flaky UI steps

Fix:

1. Run in headed mode (`npm run test:headed`).
2. Open report (`npm run report`) and inspect trace/video.

## 🧭 9. Standards Notes

### Current Standards
- UI projects use setup dependency + shared storage state.
- Use logged-out storage override only for tests that require unauthenticated start.
- Prefer page-object actions and web-first assertions.
- Centralize selectors in `/locators` to reduce duplication.
- Use `workerId` fixture for parallel-safe unique data generation.

---

## 🚀 10. Optimization Roadmap

Future enhancements for framework maturity:

### Short-Term (Next Sprint)
1. **Abstract Method Contracts** — Add `abstract expectLoaded(): Promise<void>` to BasePage
   - Enforces all page objects implement visibility verification
   - Prevents missing expectations in new page implementations

2. **Extended Tracing** — Consider `trace: 'on'` for intermittent failures
   - Current: `trace: 'on-first-retry'` (trace only on retry)
   - Benefit: Full action trace for all runs, better debugging
   - Tradeoff: Higher storage usage (~50MB per trace)

3. **ApiManager Expansion** — Add new controllers as API endpoints grow
   - Pattern: `get authController()`, `get productsController()`
   - Keep APIRequestContext properly typed for each endpoint

### Medium-Term (Next Quarter)
1. **Custom Error Boundaries** — Wrap BasePage methods with field context
   - Example: `fillElement(field: string, value: string)` catches timeout with "Email field not editable"
   - Improves debugging speed

2. **Advanced Reporting** — Integrate Allure reporter
   - Provides test history, trend analysis, flakiness detection
   - Better CI integration than plain HTML

3. **Test Data Builders** — Create fixture patterns for generating objects
   - Example: `userBuilder({ role: 'admin' })` generates complete user fixture
   - Reduces boilerplate in test setup

### Long-Term (EOY)
1. **Performance Budgets** — Add performance markers to tests
   - Track page load times, API response times
   - Fail tests that exceed thresholds

2. **Visual Regression** — Integrate screenshot comparison tool
   - Example: `expect(page).toMatchSnapshot()`
   - Detects unintended UI changes

3. **Test Dependency Graph** — Document which tests depend on which flows
   - Helps identify safe test execution order
   - Informs setup/teardown strategies