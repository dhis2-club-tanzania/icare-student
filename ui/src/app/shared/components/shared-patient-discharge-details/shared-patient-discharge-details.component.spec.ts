import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPatientDischargeDetailsComponent } from './shared-patient-discharge-details.component';

describe('SharedPatientDischargeDetailsComponent', () => {
  let component: SharedPatientDischargeDetailsComponent;
  let fixture: ComponentFixture<SharedPatientDischargeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedPatientDischargeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPatientDischargeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
