import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicOpenmrsRegistrationDashboardComponent } from './dynamic-openmrs-registration-dashboard.component';

describe('DynamicOpenmrsRegistrationDashboardComponent', () => {
  let component: DynamicOpenmrsRegistrationDashboardComponent;
  let fixture: ComponentFixture<DynamicOpenmrsRegistrationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicOpenmrsRegistrationDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicOpenmrsRegistrationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
