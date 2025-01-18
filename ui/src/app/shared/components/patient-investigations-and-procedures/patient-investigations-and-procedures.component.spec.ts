import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInvestigationsAndProceduresComponent } from './patient-investigations-and-procedures.component';

describe('PatientInvestigationsAndProceduresComponent', () => {
  let component: PatientInvestigationsAndProceduresComponent;
  let fixture: ComponentFixture<PatientInvestigationsAndProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientInvestigationsAndProceduresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientInvestigationsAndProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
