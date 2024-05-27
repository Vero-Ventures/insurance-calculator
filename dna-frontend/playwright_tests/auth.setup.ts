import { test as setup, expect } from '@playwright/test';
import { config } from './setup/config';

setup.describe.configure({ mode: 'serial' });

const authFile = config.USER_FILE;

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
