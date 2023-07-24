import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDashboardComponent } from './appointment-dashboard.component';

describe('AppointmentDashboardComponent', () => {
  let component: AppointmentDashboardComponent;
  let fixture: ComponentFixture<AppointmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
