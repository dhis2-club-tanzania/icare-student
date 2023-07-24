import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAppointmentSummaryComponent } from './patient-appointment-summary.component';

describe('PatientAppointmentSummaryComponent', () => {
  let component: PatientAppointmentSummaryComponent;
  let fixture: ComponentFixture<PatientAppointmentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientAppointmentSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAppointmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
