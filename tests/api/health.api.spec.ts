import { test, expect } from '../../playwright/fixtures';

test.describe('API health', () => {
  test('checks Playwright site availability', async ({ am }) => {
    const status = await am.healthController.check('');

    expect(status.ok).toBeTruthy();
    expect(status.status).toBe(200);
  });
});
