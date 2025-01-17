import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVisitAttributesDetailsComponent } from './patient-visit-attributes-details.component';

describe('PatientVisitAttributesDetailsComponent', () => {
  let component: PatientVisitAttributesDetailsComponent;
  let fixture: ComponentFixture<PatientVisitAttributesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientVisitAttributesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientVisitAttributesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
