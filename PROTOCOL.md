# 📜 AI Strict Protocol: Coding & Architecture

This document contains the absolute laws for code structure, naming, and locator priority. Deviation is prohibited.

### 1. The Naming Law (PascalCase)
- **Files/Folders:** ALL must use PascalCase (e.g., `src/Locators/LoginLocators.ts`).
- **Classes/Objects:** ALL must use PascalCase (e.g., `class RegistrationPage`).

### 2. Architectural Hierarchy
- **Locators (`src/Locators/`)**: Pure, logic-less Aria-role objects.
- **ComponentPage (`src/Pages/ComponentPage.ts`)**: Shared UI logic (Nav, Modals).
- **Page Objects (`src/Pages/`)**: Specific business logic inheriting from/using ComponentPage.
- **PageManager (`src/Managers/`)**: The single registry for all Page Objects.
- **BaseFixture (`src/Fixtures/`)**: Mandatory setup/teardown with Performance Audits.

### 3. Locator Ruling
- **Priority 1:** `getByRole` (Buttons, Links, Landmarks).
- **Priority 2:** `getByLabelText` (Form inputs).
- **Priority 3:** `getByText` (Validation).
- **Strict Constraint:** CSS and XPath selectors are FORBIDDEN.
- **Metadata:** Apply `.describe()` to every locator for trace visibility.

### 4. Healing Restriction
- **The Golden Rule:** The AI is permitted to patch files in `src/Locators/` only. 
- **Constraint:** Never modify Page Objects or Test Specs during a healing cycle.


<!-- How to Use

"Read docs/E2E_LIFECYCLE.md for the workflow and strictly follow docs/AI_STRICT_PROTOCOL.md for the technical implementation. Use Context7 for knowledge cutoff. Now, generate the ComponentPage and PageManager using these rules." -->