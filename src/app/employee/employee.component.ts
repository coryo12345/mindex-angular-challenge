import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Employee } from "../employee";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.css"],
})
export class EmployeeComponent {
  @Input() employee: Employee;
  @Input() allEmployees: Employee[]; // see note on README for why this input is here...
  @Output() edit: EventEmitter<Employee>;
  @Output() delete: EventEmitter<Employee>;

  totalReports: number;
  directReports: Employee[];

  constructor() {
    this.totalReports = -1;
    this.directReports = [];
    this.edit = new EventEmitter<Employee>();
    this.delete = new EventEmitter<Employee>();
  }

  ngOnInit() {
    this.getTotalReportCount();
    this.collectDirectReports();
  }

  private getTotalReportCount() {
    if (!this.employee.directReports) {
      this.totalReports = -1;
      return;
    }
    const employeesMap = this.allEmployees.reduce((acc, val) => {
      acc[val.id] = val;
      return acc;
    }, {});

    // Recursive function to find total number of reports for an employee, direct OR indirect
    // This assumes there are no circular paths, and that the employee hierarchy is a tree
    const countReports = (emp: Employee): number => {
      if (!emp.directReports) {
        return 1;
      } else {
        let count = 1;
        for (const id of emp.directReports) {
          if (employeesMap[id]) {
            count += countReports(employeesMap[id]);
          }
        }
        return count;
      }
    };

    this.totalReports = countReports(this.employee) - 1;
  }

  private collectDirectReports() {
    if (!this.employee.directReports) {
      this.directReports = [];
      return;
    }
    for (const id of this.employee.directReports) {
      const employee = this.allEmployees.find((e) => e.id === id);
      this.directReports.push(employee);
    }
  }
}
