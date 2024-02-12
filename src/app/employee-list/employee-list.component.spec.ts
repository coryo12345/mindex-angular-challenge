import { async, TestBed } from "@angular/core/testing";
import { Component, Input } from "@angular/core";

import { EmployeeListComponent } from "./employee-list.component";
import { EmployeeService } from "../employee.service";
import { MatDialog } from "@angular/material/dialog";
import { of } from "rxjs";
import { mockEmployees } from "src/mocks/employees";
import { Employee } from "src/app/employee";

@Component({ selector: "app-employee", template: "" })
class EmployeeComponent {
  @Input("employee") employee: Employee;
  @Input("allEmployees") allEmployees: Employee[];
}

@Component({ selector: "app-mat-grid-list", template: "" })
class GridListComponent {}

@Component({ selector: "app-mat-grid-tile", template: "" })
class GridTileComponent {}

const employeeServiceSpy = jasmine.createSpyObj("EmployeeService", [
  "getAll",
  "get",
  "save",
  "remove",
]);

describe("EmployeeListComponent", () => {
  beforeEach(async(() => {
    employeeServiceSpy.getAll.and.returnValue(of([...mockEmployees]));
    employeeServiceSpy.save.and.returnValue(of());
    employeeServiceSpy.remove.and.returnValue(of());

    TestBed.configureTestingModule({
      declarations: [
        EmployeeListComponent,
        EmployeeComponent,
        GridListComponent,
        GridTileComponent,
      ],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj({
            open: jasmine.createSpyObj({
              afterClosed: of(mockEmployees[0]),
            }),
          }),
        },
      ],
    }).compileComponents();
  }));

  it("should create the component", async(() => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  }));

  it("renders an employee component for each employee", async(() => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    fixture.detectChanges();
    const comp = fixture.debugElement
      .componentInstance as EmployeeListComponent;

    comp.ngOnInit();

    const container = fixture.nativeElement as HTMLDivElement;
    const employeeComponents = container.querySelectorAll("app-employee");
    expect(employeeComponents.length).toBe(mockEmployees.length);
  }));

  it("opens a dialog when editEmployee is called, and saves new employee info on close", async(() => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const comp = fixture.debugElement
      .componentInstance as EmployeeListComponent;

    comp.ngOnInit();
    comp.editEmployee(mockEmployees[0]);

    expect(employeeServiceSpy.save).toHaveBeenCalledWith(mockEmployees[0]);
  }));

  it("opens a dialog when deleteEmployee is called, and removes employee on close", async(() => {
    const fixture = TestBed.createComponent(EmployeeListComponent);
    const comp = fixture.debugElement
      .componentInstance as EmployeeListComponent;

    comp.ngOnInit();
    comp.deleteEmployee(mockEmployees[0]);

    expect(employeeServiceSpy.remove).toHaveBeenCalledWith(mockEmployees[0]);
  }));
});
