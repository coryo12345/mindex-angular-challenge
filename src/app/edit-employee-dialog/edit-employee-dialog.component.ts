import { CurrencyPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from 'src/app/employee';

/**
 * Normally I would make Edit & Delete dialogs separate components,
 * but Task 4 reads like it wants me to make one (new) single component to do both.
 */

export interface EditDialogData {
  action: 'edit' | 'delete';
  employee: Employee;
}

@Component({
  selector: 'app-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.css'],
})
export class EditEmployeeDialogComponent {
  title: string;
  modifiableEmployee: Employee;
  compensation?: string;

  constructor(
    public dialogRef: MatDialogRef<EditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData,
    private currency: CurrencyPipe,
  ) {
    this.setTitle();
    // create a deep copy that can be modified safely
    this.modifiableEmployee = JSON.parse(JSON.stringify(data.employee));
    this.compensation = this.modifiableEmployee.compensation?.toString();
    this.formatCompensation();
  }

  private setTitle() {
    this.title =
      (this.data.action === 'edit' ? 'Edit' : 'Delete') + ' Employee';
  }

  formatCompensation(el?: FocusEvent) {
    try {
      const result = this.currency.transform(this.compensation, '$');
      this.modifiableEmployee.compensation = isNaN(
        parseFloat(this.compensation),
      )
        ? undefined
        : parseFloat(this.compensation);
      el && ((el.target as HTMLInputElement).value = result);
    } catch (err) {
      el && ((el.target as HTMLInputElement).value = '');
      delete this.modifiableEmployee.compensation;
    }
  }
}
