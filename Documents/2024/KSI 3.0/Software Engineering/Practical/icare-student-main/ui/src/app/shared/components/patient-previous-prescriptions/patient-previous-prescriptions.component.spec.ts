import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPreviousPrescriptionsComponent } from './patient-previous-prescriptions.component';

describe('PatientPreviousPrescriptionsComponent', () => {
  let component: PatientPreviousPrescriptionsComponent;
  let fixture: ComponentFixture<PatientPreviousPrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientPreviousPrescriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPreviousPrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
