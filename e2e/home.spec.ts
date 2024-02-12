import { test, expect } from '@playwright/test';
import { HomePage } from './home.page';

test('has 4 employee cards', async ({ page }) => {
  const homepage = new HomePage(page);
  await homepage.goto();

  const allCards = await homepage.employeeCards.all();
  expect(allCards.length).toBe(4);
});

test('can open delete dialog, and press cancel to close', async ({ page }) => {
  const homepage = new HomePage(page);
  await homepage.goto();
  await homepage.expandReportsList();
  await homepage.deleteButton.click();
  await homepage.dialogCancel.click();

  // wait for delete service request
  await homepage.page.waitForTimeout(1000);
  await homepage.expandReportsList();

  const reportRows = await homepage.reportRows.all();
  expect(reportRows.length).toBe(2);
});

test('can delete an employee via delete dialog', async ({ page }) => {
  const homepage = new HomePage(page);
  await homepage.goto();
  await homepage.expandReportsList();
  await homepage.deleteButton.click();
  await homepage.dialogConfirm.click();

  // wait for delete service request
  await homepage.page.waitForTimeout(1000);
  await homepage.expandReportsList();

  const reportRows = await homepage.reportRows.all();
  expect(reportRows.length).toBe(1);
});
