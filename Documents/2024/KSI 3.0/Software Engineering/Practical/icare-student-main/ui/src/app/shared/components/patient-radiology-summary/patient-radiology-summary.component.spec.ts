import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRadiologySummaryComponent } from './patient-radiology-summary.component';

describe('PatientRadiologySummaryComponent', () => {
  let component: PatientRadiologySummaryComponent;
  let fixture: ComponentFixture<PatientRadiologySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientRadiologySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRadiologySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
