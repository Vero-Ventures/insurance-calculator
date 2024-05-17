import { test, chromium } from '@playwright/test';
import { config } from './config';

test('Login test', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${config.BASE_URL}/auth`);

  // Select elements
  const email = await page.getByText('Email');
  const password = await page.getByText('Password');

  // TODO: Eventually want to randomly generate email
  await email?.fill('jyoon72@my.bcit.ca');
  // TODO: Eventually want to create validation for password
  await password?.fill('123456');

  // TODO: Maybe make the button text "Sign in" instead of "Login" to stay consistent
  const signInButton = await page.$('button:has-text("Login")');
  await signInButton?.click();

  try {
    await page.waitForURL('**/landing');
    console.log('Sign-in test passed');
  } catch (error) {
    console.error(`Sign-in test failed, URL: ${page.url()}`);
  }
});
