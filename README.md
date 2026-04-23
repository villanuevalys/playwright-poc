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

## 🛠️ 2. Installation & Environment Setup

### Step 1: Initialize Project

```bash
# Create and enter directory
mkdir playwright-enterprise-framework && cd playwright-enterprise-framework

# Initialize NPM and Playwright
npm init -y
npm init playwright@latest -- --typescript --gh-actions
```

### Step 2: Ensure TypeScript Is Installed

Install TypeScript locally before generating the config file:

```bash
npm install typescript --save-dev
```

### Step 3: Initialize TypeScript Configuration

Generate the base tsconfig.json:

```bash
npx tsc --init
```

### Step 4: Configure tsconfig.json (Overwrite with Aliases)

Replace the contents of tsconfig.json with the following to enable enterprise path aliasing:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "Node16",
    "moduleResolution": "node16",
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "@base/*": ["src/base/*"],
      "@ui/*": ["src/ui/*"],
      "@pages/*": ["src/ui/pages/*"],
      "@components/*": ["src/ui/components/*"],
      "@locators/*": ["src/ui/locators/*"],
      "@api/*": ["src/api/*"],
      "@utils/*": ["src/utils/*"],
      "@playwright/*": ["playwright/*"]
    },
    "lib": ["ESNext", "DOM"],
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "tests/**/*.ts", "playwright/**/*.ts", "playwright.config.ts"]
}
```

### Step 5: Install Runtime/Test Dependencies

```bash
npm install dotenv allure-playwright
```

### Step 6: Quick Validation

```bash
npx tsc --noEmit
npx playwright test --list
```

## ⚙️ 3. Core Framework Setup
### The Base Page Class (src/base/BasePage.ts)

```ts
import { Page, test } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async clickElement(selector: string, name: string) {
    await test.step(`User clicks on: ${name}`, async () => {
      const locator = this.page.locator(selector);
      await locator.waitFor({ state: 'visible' });
      await locator.click();
    });
  }
}
```

### The Custom Fixture (playwright/fixtures.ts)

```ts
import { test as base } from '@playwright/test';
import { PageManager } from '../src/ui/PageManager';

export const test = base.extend<{ pm: PageManager }>({
  pm: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
});
```

## 🚀 4. Usage

### Clean Imports

Thanks to the tsconfig setup, you can now import using absolute-style paths:

```ts
import { test } from '@playwright/fixtures';
import { LoginPage } from '@pages/login.page';
```

### Execution

Run all tests:

```bash
npx playwright test
```

Run in UI mode:

```bash
npx playwright test --ui
```