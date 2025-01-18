import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVitalsSummaryComponent } from './patient-vitals-summary.component';

describe('PatientVitalsSummaryComponent', () => {
  let component: PatientVitalsSummaryComponent;
  let fixture: ComponentFixture<PatientVitalsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientVitalsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientVitalsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
