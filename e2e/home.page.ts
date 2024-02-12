import { Locator, Page } from "@playwright/test";
import { URL } from "playwright.config";

export class HomePage {
  readonly page: Page;

  readonly employeeCard: Locator;
  readonly directReportExpansion: Locator;
  readonly reportRow: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeCard = page.locator("app-employee").first();
    this.directReportExpansion = this.employeeCard.locator(
      "mat-expansion-panel-header",
    );
    this.editButton = this.employeeCard.locator(".report-row").first();
  }

  async goto() {
    await this.page.goto(URL);
  }
}
