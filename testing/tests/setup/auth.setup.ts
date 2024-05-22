import { test as setup, expect } from '@playwright/test';
import { config } from './config';

setup.describe.configure({ mode: 'serial' });

const authFile = 'tests/setup/user.json';

const testData = {
  email: 'test@123.com',
  password: '123456',
};

setup('Setup authenticated user', async ({ browser }) => {
  const page = await browser.newPage();
  try {
    await page.goto(`${config.BASE_URL}/auth`);
    const email = await page.getByText('Email');
    const password = await page.getByText('Password');
    await email?.fill(testData.email);
    await password?.fill(testData.password);

    const signInButton = await page.$('button:has-text("Login")');
    await signInButton?.click();
    await page.waitForURL('**/landing');
    await expect(page).toHaveURL(/.*\/landing/, { timeout: 5000 });
    await page.context().storageState({ path: authFile });
    console.log('Authentication setup complete');
  } catch (error) {
    console.error('Authentication setup failed');
    throw error;
  }
});

setup('Remove existing clients', async ({ browser }) => {
  const context = await browser.newContext({ storageState: authFile });
  const page = await context.newPage();
  try {
    await page.goto(`${config.BASE_URL}/client-list`);
    const deleteButton = await page.$('button[class="delete-button"]');
    while (deleteButton) {
      await deleteButton.click();
      await page.waitForTimeout(1000);
    }
  } catch (error) {
    console.error('Remove existing clients failed');
    throw error;
  } finally {
    await context.close();
  }
});
