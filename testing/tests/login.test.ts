import { test, chromium } from '@playwright/test';

test('Signup test', async () => {
  // Open a browser instance
  const browser = await chromium.launch();
  // Launch a new browser context
  // const context = await browser.newContext();
  // Create a new page
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto('http://localhost:4200/auth');

  // Select elements
  const signInEmail = await page.$('#signinemail');
  const signInPassword = await page.$('#signinpassword');

  // TODO: Eventually want to randomly generate email
  await signInEmail?.fill('jyoon72@my.bcit.ca');
  // TODO: Eventually want to create validation for password
  await signInPassword?.fill('123456');

  // TODO: Maybe make the button text "Sign in" instead of "Login" to stay consistent
  const signInButton = await page.$('button:has-text("Login")');
  await signInButton?.click();

  try {
    await page.waitForSelector('text=Sign out', { state: 'visible' });
    console.log('Sign-in test passed');
  } catch (error) {
    console.error('Sign-in test failed');
  }
});
