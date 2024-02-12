import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  EditDialogData,
  EditEmployeeDialogComponent,
} from './edit-employee-dialog.component';

@Component({
  selector: 'mat-dialog-content',
  template: '<ng-content></ng-content>',
})
class DialogContentComponent {}

@Component({
  selector: 'mat-dialog-actions',
  template: '<ng-content></ng-content>',
})
class DialogActionsComponent {}

@Component({
  selector: 'mat-form-field',
  template: '<ng-content></ng-content>',
})
class MatLabelComponent {}

@Component({ selector: 'mat-label', template: '<ng-content></ng-content>' })
class MatFormFieldComponent {}

describe('EditEmployeeDialogComponent', () => {
  let component: EditEmployeeDialogComponent;
  let fixture: ComponentFixture<EditEmployeeDialogComponent>;
  let data: EditDialogData;

  beforeEach(async(() => {
    data = {
      action: 'edit',
      employee: {
        id: 1,
        firstName: 'bob',
        lastName: 'smith',
        position: 'ceo',
      },
    };
    TestBed.configureTestingModule({
      imports: [FormsModule, MatDialogModule],
      declarations: [
        EditEmployeeDialogComponent,
        NgForm,
        DialogContentComponent,
        DialogActionsComponent,
        MatFormFieldComponent,
        MatLabelComponent,
      ],
      providers: [
        CurrencyPipe,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    });
  }));

  const setup = () => {
    TestBed.compileComponents();
    fixture = TestBed.createComponent(EditEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create a component', () => {
    setup();
    expect(component).toBeTruthy();
  });

  describe('dialog title', () => {
    it('should show an edit title if the action is edit', () => {
      setup();
      const title = (fixture.nativeElement as HTMLDivElement).querySelector(
        'h2[mat-dialog-title]',
      ).innerHTML;
      expect(title).toBe('Edit Employee');
    });

    it('should show a delete title if the action is delete', () => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, {
        useValue: { ...data, action: 'delete' },
      });
      setup();
      const title = (fixture.nativeElement as HTMLDivElement).querySelector(
        'h2[mat-dialog-title]',
      ).innerHTML;
      expect(title).toBe('Delete Employee');
    });
  });

  describe('formatCompensation()', () => {
    it('formats to a dollar value if the input is a valid float', () => {
      setup();
      const input: HTMLInputElement = (
        fixture.nativeElement as HTMLElement
      ).querySelector('input[name="compensation"]');
      component.compensation = '123.10';
      component.formatCompensation({ target: input } as any);

      expect(component.modifiableEmployee.compensation).toBe(123.1);
      expect(input.value).toBe('$123.10');
    });

    it('sets compensation to undefined if the input is not a float', () => {
      setup();
      const input: HTMLInputElement = (
        fixture.nativeElement as HTMLElement
      ).querySelector('input[name="compensation"]');
      component.compensation = 'abc';
      component.formatCompensation({ target: input } as any);

      expect(component.modifiableEmployee.compensation).toBe(undefined);
      expect(input.value).toBe('');
    });
  });
});
