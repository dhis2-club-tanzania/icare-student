import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPatientProfileComponent } from './new-patient-profile.component';

describe('NewPatientProfileComponent', () => {
  let component: NewPatientProfileComponent;
  let fixture: ComponentFixture<NewPatientProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPatientProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPatientProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
