import { test } from '@playwright/test';
import { config } from '../setup/config';

const authFile = 'testing/tests/setup/user.json';

test.describe.configure({ mode: 'serial' });

test('Create new client', async ({ browser }) => {
  const context = await browser.newContext({ storageState: authFile });
  const page = await context.newPage();
  try {
    await page.goto(`${config.BASE_URL}`);
    await page.goto(`${config.BASE_URL}/client-list`);
    const createButton = await page.$('button:has-text("New Client")');
    await createButton?.click();
    await page.waitForSelector('app-action-item >> text="New Client"', {
      state: 'visible',
    });
  } catch (error) {
    console.error('Create new client failed');
    throw error;
  } finally {
    // Erase existing data
    const deleteButton = await page.$(
      'button[class="delete-button ng-star-inserted"]'
    );
    await deleteButton?.click();
    await page.waitForTimeout(500);
    const confirmButton = await page.$('button:has-text("Delete")');
    await confirmButton?.click();
    await page.waitForTimeout(2000);
    await context.close();
  }
});
