import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPatientDetailsComponent } from './other-patient-details.component';

describe('OtherPatientDetailsComponent', () => {
  let component: OtherPatientDetailsComponent;
  let fixture: ComponentFixture<OtherPatientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherPatientDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
