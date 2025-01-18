import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargeDeceasedPatientModalComponent } from './discharge-deceased-patient-modal.component';

describe('DischargeDeceasedPatientModalComponent', () => {
  let component: DischargeDeceasedPatientModalComponent;
  let fixture: ComponentFixture<DischargeDeceasedPatientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DischargeDeceasedPatientModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargeDeceasedPatientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
