import { test } from 'playwright-test-coverage';
import { config } from './setup/config';

// For testing existing email
const testData = {
  email: 'test@123.com',
  password: '123456',
};

test('Signup with existing email', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
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
  }
});
