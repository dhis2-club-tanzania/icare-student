import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicationSummaryComponent } from './patient-medication-summary.component';

describe('PatientMedicationSummaryComponent', () => {
  let component: PatientMedicationSummaryComponent;
  let fixture: ComponentFixture<PatientMedicationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMedicationSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMedicationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
