import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargePatientModalComponent } from './discharge-patient-modal.component';

describe('DischargePatientModalComponent', () => {
  let component: DischargePatientModalComponent;
  let fixture: ComponentFixture<DischargePatientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DischargePatientModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargePatientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
