import { test, expect } from '@playwright/test';
import { config } from '../setup/config';

const authFile = config.USER_FILE;

test('Update client and check results', async ({ browser }) => {
  const context = await browser.newContext({ storageState: authFile });
  const page = await context.newPage();
  try {
    await page.goto(`${config.BASE_URL}/auth`);
    await page.waitForTimeout(1000);
    await page.goto(`${config.BASE_URL}/client-list`);
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'New Client' }).click();
    await page.waitForTimeout(1000);
    const loadButton = await page.$(
      'tui-island:has-text("New Client") >> button[class="action-button"]:has-text("Load")'
    );
    await loadButton?.click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*\/client\/.+/, { timeout: 5000 });

    await page.getByLabel('Name').fill('Test');
    await page.getByLabel('Expected Retirement Age').fill('65');
    await page.getByLabel('Province')?.click();
    await page.getByRole('option', { name: 'BC' }).first().click();
    await page.getByLabel('Annual Income ($CAD)')?.fill('100000');
    await page.getByLabel('Income Replacement Multiplier')?.fill('0.6');
    await page.getByRole('button', { name: 'Results' }).click();

    await expect(page.locator('tui-island:has-text("Age")')).toHaveText(/.*54/);
    await expect(
      page.locator('tui-island:has-text("Years of Active Income")')
    ).toHaveText(/.*11/);
    await expect(
      page.locator('tui-island:has-text("Amount Insured for Income ($CAD)")')
    ).toHaveText(/.*\$60,000.00/);
    await expect(page.locator('tui-island:has-text("Tax Bracket")')).toHaveText(
      /.*\$91310.00+/
    );
  } catch (error) {
    console.error('Update client failed');
    throw error;
  } finally {
    await page.goto(`${config.BASE_URL}/client-list`);
    await page.waitForTimeout(1000);
    // Erase existing data
    const deleteButton = await page.$(
      'tui-island:has-text("Test") >> button[class="delete-button ng-star-inserted"]'
    );
    await deleteButton?.click();
    await page.waitForTimeout(1000);
    const confirmButton = await page.$('button:has-text("Delete")');
    await confirmButton?.click();
    await page.waitForTimeout(1000);
    await context.close();
  }
});
