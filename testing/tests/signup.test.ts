import { test, chromium } from '@playwright/test';
import { config } from './config';

test('Signup test', async () => {
  // Open a browser instance
  const browser = await chromium.launch();
  // Launch a new browser context
  // const context = await browser.newContext();
  // Create a new page
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto(`${config.BASE_URL}/auth`);

  // Select elements
  const email = await page.$('input:has-text("Email")');
  const password = await page.$('input:has-text("Password")');

  // TODO: Eventually want to randomly generate email
  await email?.fill('jyoon72@my.bcit.ca');
  // TODO: Eventually want to create validation for password
  await password?.fill('123456');

  const signupButton = await page.$('button:has-text("Signup")');
  await signupButton?.click();

  try {
    await page.waitForURL(`${config.BASE_URL}/landing`);
    console.log('Signup test passed');
  } catch (error) {
    console.error('Signup test failed');
  }
});
