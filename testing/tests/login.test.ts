import { test, chromium, expect } from '@playwright/test';
import { config } from './config';

// For testing existing email
const testData = {
  email: 'jihoonyoon0@gmail.com',
  password: '123456',
};

test('Login with registered email and correct password', async () => {
  const browser = await chromium.launch();
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
    console.log('Login with registered email and correct password passed');
  } catch (error) {
    console.error('Login with registered email and correct password failed');
    throw error;
  } finally {
    await browser.close();
  }
});
