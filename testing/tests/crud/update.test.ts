import { test } from '@playwright/test';
// import { config } from '../setup/config';

test.describe.configure({ mode: 'serial' });

test('Update existing client', async ({ browser }) => {
  const context = await browser.newContext({ storageState: './user.json' });
  // const page = await context.newPage();
  try {
    console.log();
  } catch (error) {
    console.log();
  } finally {
    await context.close();
  }
});
