import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientClinicalNotesSummaryComponent } from './patient-clinical-notes-summary.component';

describe('PatientClinicalNotesSummaryComponent', () => {
  let component: PatientClinicalNotesSummaryComponent;
  let fixture: ComponentFixture<PatientClinicalNotesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientClinicalNotesSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientClinicalNotesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
