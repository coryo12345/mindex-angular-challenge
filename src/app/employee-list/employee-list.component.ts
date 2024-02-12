import { Component, OnInit } from '@angular/core';
import { catchError, map, reduce } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { EditEmployeeDialogComponent } from 'src/app/edit-employee-dialog/edit-employee-dialog.component';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return (this.errorMessage = e.message || 'Unable to retrieve employees');
  }

  private getEmployees() {
    this.employeeService
      .getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map((emps) => (this.employees = emps)),
        catchError(this.handleError.bind(this)),
      )
      .subscribe();
  }

  editEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      data: {
        action: 'edit',
        employee,
      },
    });

    dialogRef.afterClosed().subscribe((employee?: Employee) => {
      if (!employee) return;
      this.employeeService.save(employee).subscribe(() => {
        this.getEmployees();
      });
    });
  }

  deleteEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      data: {
        action: 'delete',
        employee,
      },
    });

    dialogRef.afterClosed().subscribe((employee: Employee) => {
      if (!employee) return;
      this.employeeService.remove(employee).subscribe(() => {
        this.getEmployees();
      });
    });
  }
}
