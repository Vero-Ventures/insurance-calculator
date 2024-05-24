import { test } from 'playwright-test-coverage';
import { config } from '../setup/config';

const authFile = config.USER_FILE;

test('Create new client', async ({ browser }) => {
  const context = await browser.newContext({ storageState: authFile });
  const page = await context.newPage();
  try {
    await page.goto(`${config.BASE_URL}/auth`);
    await page.waitForTimeout(1000);
    await page.goto(`${config.BASE_URL}/client-list`);
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'New Client' }).click();
    await page.waitForTimeout(1000);
    await page.waitForSelector('app-action-item >> text="New Client"', {
      state: 'visible',
    });
  } catch (error) {
    console.error('Create new client failed');
    throw error;
  } finally {
    // Erase existing data
    const deleteButton = await page.$(
      'tui-island:has-text("New Client") >> button[class="delete-button ng-star-inserted"]'
    );
    await deleteButton?.click();
    await page.waitForTimeout(1000);
    const confirmButton = await page.$('button:has-text("Delete")');
    await confirmButton?.click();
    await page.waitForTimeout(1000);
    await context.close();
  }
});
