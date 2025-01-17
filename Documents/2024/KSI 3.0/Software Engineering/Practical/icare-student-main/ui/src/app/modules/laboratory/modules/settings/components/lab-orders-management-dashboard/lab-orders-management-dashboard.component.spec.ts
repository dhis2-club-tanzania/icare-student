import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOrdersManagementDashboardComponent } from './lab-orders-management-dashboard.component';

describe('LabOrdersManagementDashboardComponent', () => {
  let component: LabOrdersManagementDashboardComponent;
  let fixture: ComponentFixture<LabOrdersManagementDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabOrdersManagementDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabOrdersManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
