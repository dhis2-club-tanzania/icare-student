import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLabResultsSummaryComponent } from './patient-lab-results-summary.component';

describe('PatientLabResultsSummaryComponent', () => {
  let component: PatientLabResultsSummaryComponent;
  let fixture: ComponentFixture<PatientLabResultsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientLabResultsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientLabResultsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
