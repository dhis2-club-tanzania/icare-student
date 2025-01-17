import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientProceduresSummaryComponent } from './patient-procedures-summary.component';

describe('PatientProceduresSummaryComponent', () => {
  let component: PatientProceduresSummaryComponent;
  let fixture: ComponentFixture<PatientProceduresSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientProceduresSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientProceduresSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
