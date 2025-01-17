import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEnrollmentsComponent } from './patient-enrollments.component';

describe('PatientEnrollmentsComponent', () => {
  let component: PatientEnrollmentsComponent;
  let fixture: ComponentFixture<PatientEnrollmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientEnrollmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEnrollmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
