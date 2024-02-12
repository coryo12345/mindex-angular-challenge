import { Locator, Page } from '@playwright/test';
import { URL } from 'playwright.config';

export class HomePage {
  readonly page: Page;

  readonly employeeCards: Locator;
  readonly directReportExpansion: Locator;
  readonly reportRows: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  readonly dialog: Locator;
  readonly dialogConfirm: Locator;
  readonly dialogCancel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeCards = page.locator('.employee-item');
    this.directReportExpansion = this.employeeCards
      .first()
      .locator('mat-expansion-panel-header')
      .first();
    this.reportRows = this.employeeCards.first().locator('.report-row');
    this.editButton = this.reportRows
      .first()
      .locator('.edit-dialog-btn')
      .first();
    this.deleteButton = this.reportRows
      .first()
      .locator('.delete-dialog-btn')
      .first();
    this.dialog = page.locator('.mat-dialog-container').first();
    this.dialogConfirm = this.dialog.locator('.confirm-button');
    this.dialogCancel = this.dialog.locator('.cancel-button');
  }

  async goto() {
    await this.page.goto(URL);
    await this.page.waitForSelector('.employee-item');
  }

  async expandReportsList() {
    await this.directReportExpansion.click();
  }
}
