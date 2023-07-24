import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAppointmentDashboardComponent } from './shared-appointment-dashboard.component';

describe('SharedAppointmentDashboardComponent', () => {
  let component: SharedAppointmentDashboardComponent;
  let fixture: ComponentFixture<SharedAppointmentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedAppointmentDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAppointmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
