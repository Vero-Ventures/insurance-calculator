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
  const signupEmail = await page.$('#signupemail');
  const signupPassword = await page.$('#signuppassword');

  // TODO: Eventually want to randomly generate email
  await signupEmail?.fill('jyoon72@my.bcit.ca');
  // TODO: Eventually want to create validation for password
  await signupPassword?.fill('123456');

  const signupButton = await page.$('button:has-text("Signup")');
  await signupButton?.click();

  try {
    await page.waitForSelector(
      'text=Check your email to complete your sign up.',
      { state: 'visible' }
    );
    console.log('Signup test passed');
  } catch (error) {
    console.error('Signup test failed');
  }
});
