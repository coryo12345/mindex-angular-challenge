import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { EmployeeComponent } from './employee.component';
import { mockEmployees } from 'src/mocks/employees';
import { MatIconModule } from '@angular/material/icon';

@Component({ selector: 'mat-card', template: '<ng-content></ng-content>' })
class CardComponent {}

@Component({
  selector: 'mat-card-header',
  template: '<ng-content></ng-content>',
})
class CardHeaderComponent {}

@Component({
  selector: 'mat-card-title',
  template: '<ng-content></ng-content>',
})
class CardTitleComponent {}

@Component({
  selector: 'mat-card-subtitle',
  template: '<ng-content></ng-content>',
})
class CardSubtitleComponent {}

@Component({
  selector: 'mat-card-content',
  template: '<ng-content></ng-content>',
})
class CardContentComponent {}

@Component({
  selector: 'mat-accordian',
  template: '<ng-content></ng-content>',
})
class AccordianComponent {}

@Component({
  selector: 'mat-expansion-panel',
  template: '<ng-content></ng-content>',
})
class ExpansionPanelComponent {}

@Component({
  selector: 'mat-expansion-panel-header',
  template: '<ng-content></ng-content>',
})
class ExpansionPanelHeaderComponent {}

@Component({
  selector: 'mat-panel-title',
  template: '<ng-content></ng-content>',
})
class PanelTitleComponent {}

@Component({
  selector: 'mat-list',
  template: '<ng-content></ng-content>',
})
class ListComponent {}

@Component({
  selector: 'mat-list-item',
  template: '<ng-content></ng-content>',
})
class ListItemComponent {}

@Component({
  selector: 'mat-divider',
  template: '',
})
class DividerComponent {}

const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
  'getAll',
  'get',
  'save',
  'remove',
]);

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [
        EmployeeComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleComponent,
        CardSubtitleComponent,
        CardContentComponent,
        DividerComponent,
        AccordianComponent,
        ExpansionPanelComponent,
        ExpansionPanelHeaderComponent,
        PanelTitleComponent,
        ListComponent,
        ListItemComponent,
      ],
      providers: [
        { provide: 'EmployeeService', useValue: employeeServiceSpy },
        { provide: 'employee', useValue: mockEmployees[0] },
      ],
    });
  }));

  const setup = () => {
    TestBed.compileComponents();
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.debugElement.componentInstance;

    component.allEmployees = [...mockEmployees];
    component.employee = mockEmployees[0];

    fixture.detectChanges();
  };

  it('should create the component', async(() => {
    setup();
    expect(component).toBeTruthy();
  }));

  describe('total report count', () => {
    it('shows the total number of reports if this employee has any reports', async(() => {
      setup();
      component.ngOnInit();

      const el = fixture.nativeElement.querySelector('.total-report-count dd');
      expect(component.totalReports).toBe(3);
      expect(el.innerHTML).toBe('3');
    }));

    it('does not show a section for total report count if this employee has no reports', async(() => {
      setup();
      component.employee = mockEmployees[3];
      component.ngOnInit();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const el = fixture.nativeElement.querySelector(
          '.total-report-count dd',
        );
        expect(component.totalReports).toBe(-1);
        expect(el).toBe(null);
      });
    }));
  });

  describe('direct reports', () => {
    it('renders a row for each direct report this employee has', async(() => {
      setup();
      component.ngOnInit();

      const title = fixture.nativeElement.querySelector(
        '.employee-report-container mat-panel-title',
      ).innerHTML;
      expect(title).toBe('Direct Reports');

      const rows = fixture.nativeElement.querySelectorAll(
        '.employee-report-list .report-row',
      );
      expect(rows.length).toBe(1);
      expect(rows[0].innerText).toContain('bob johnson');
    }));

    it('opens an edit dialog when the edit icon is clicked', () => {
      setup();
      component.ngOnInit();

      const editSpy = spyOn(component.edit, 'emit');
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector('.edit-dialog-btn');
      btn.dispatchEvent(new MouseEvent('click'));

      expect(editSpy).toHaveBeenCalledWith(mockEmployees[1]);
    });

    it('opens a delete dialog when the delete icon is clicked', () => {
      setup();
      component.ngOnInit();

      const deleteSpy = spyOn(component.delete, 'emit');
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector('.delete-dialog-btn');
      btn.dispatchEvent(new MouseEvent('click'));

      expect(deleteSpy).toHaveBeenCalledWith(mockEmployees[1]);
    });

    it('renders no rows when the employee has no direct reports', () => {
      setup();
      component.employee = mockEmployees[3];
      component.ngOnInit();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const title = fixture.nativeElement.querySelector(
          '.employee-report-container mat-panel-title',
        );
        expect(title).toBe(null);

        const rows = fixture.nativeElement.querySelectorAll(
          '.employee-report-list .report-row',
        );
        expect(rows.length).toBe(0);
      });
    });
  });

  // these tests would be similar of the ones i've done above. Not going to implement now.
  // commenting out so they dont get parked as pending

  // describe("employee compensation", () => {
  //   it(
  //     "shows the employees compensation if the employee has compensation defined",
  //   );

  //   it(
  //     "does not show the compensation if the employee does not have it defined",
  //   );
  // });

  // it("shows the employees name in the title");

  // it("shows the employees job title as a subtitle");

  // it("shows the employee id in the content of the card");
});
