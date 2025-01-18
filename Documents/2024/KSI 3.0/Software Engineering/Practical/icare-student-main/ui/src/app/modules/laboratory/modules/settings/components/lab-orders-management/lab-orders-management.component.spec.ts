import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOrdersManagementComponent } from './lab-orders-management.component';

describe('LabOrdersManagementComponent', () => {
  let component: LabOrdersManagementComponent;
  let fixture: ComponentFixture<LabOrdersManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabOrdersManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabOrdersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
