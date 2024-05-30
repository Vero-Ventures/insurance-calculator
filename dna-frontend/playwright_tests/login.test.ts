import { test, expect } from '@playwright/test';
import { config } from './setup/config';

// For testing existing email
const testData = {
  email: 'test@123.com',
  password: '123456',
};

test('Login with registered email and correct password', async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`${config.BASE_URL}/auth`);
    const email = await page.getByText('Email');
    const password = await page.getByText('Password');
    await email?.fill(testData.email);
    await password?.fill(testData.password);

    const signInButton = await page.getByRole('button', { name: 'Login' });
    await signInButton?.click();
    await page.waitForURL('**/landing');
    await expect(page).toHaveURL(/.*\/landing/, { timeout: 5000 });
    console.log('Login with registered email and correct password passed');
  } catch (error) {
    console.error('Login with registered email and correct password failed');
    throw error;
  }
});

test('Login with registered email and incorrect password', async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`${config.BASE_URL}/auth`);
    const email = await page.getByText('Email');
    const password = await page.getByText('Password');
    await email?.fill(testData.email);
    await password?.fill(testData.password + '1');

    const signInButton = await page.$('button:has-text("Login")');
    await signInButton?.click();
    await page.waitForSelector('text="Invalid login credentials"', {
      state: 'visible',
    });
    console.log('Login with registered email and incorrect password passed');
  } catch (error) {
    console.error('Login with registered email and incorrect password failed');
    throw error;
  }
});

test('Login with unregistered email and password', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`${config.BASE_URL}/auth`);
    const email = await page.getByText('Email');
    const password = await page.getByText('Password');
    await email?.fill(testData.email + '1');
    await password?.fill(testData.password);

    const signInButton = await page.$('button:has-text("Login")');
    await signInButton?.click();
    await page.waitForSelector('text="Invalid login credentials"', {
      state: 'visible',
    });
    console.log('Login with unregistered email and password passed');
  } catch (error) {
    console.error('Login with unregistered email and password failed');
    throw error;
  }
});
