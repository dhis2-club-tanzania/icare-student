import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredPatientDetailsComponent } from './registered-patient-details.component';

describe('RegisteredPatientDetailsComponent', () => {
  let component: RegisteredPatientDetailsComponent;
  let fixture: ComponentFixture<RegisteredPatientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredPatientDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredPatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
