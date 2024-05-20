import { test, chromium } from '@playwright/test';
import { config } from './config';

// For testing existing email
const testData = {
  email: 'jyoon72@my.bcit.ca',
  password: '12345678',
};

test('Signup with unregistered email', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(`${config.BASE_URL}/auth`);

    const email = await page.getByText('Email');
    const password = await page.getByText('Password');

    // TODO: Eventually want to randomly generate email
    await email?.fill('jyoon72@my.bcit.ca');
    // TODO: Eventually want to create validation for password
    await password?.fill('123456');

    const signupButton = await page.$('button:has-text("Signup")');
    await signupButton?.click();
    // TODO: Update -- I think email verification has been removed?
    // await page.waitForURL('**/landing');
    // console.log('Signup test passed');
  } catch (error) {
    console.error('Signup test with unregistered email failed');
    throw error;
  } finally {
    await browser.close();
  }
});

test('Signup with existing email', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(`${config.BASE_URL}/auth`);

    const email = await page.getByText('Email');
    const password = await page.getByText('Password');

    await email?.fill(testData.email);
    await password?.fill(testData.password);

    const signupButton = await page.$('button:has-text("Signup")');
    await signupButton?.click();
    await page.waitForSelector('text="User already registered"', {
      state: 'visible',
    });
    console.error('Signup test with existing email passed');
  } catch (error) {
    console.log('Signup test with existing email failed');
    throw error;
  } finally {
    await browser.close();
  }
});
