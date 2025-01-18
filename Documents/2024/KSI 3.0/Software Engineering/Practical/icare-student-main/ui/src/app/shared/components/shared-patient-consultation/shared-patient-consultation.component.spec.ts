import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPatientConsultationComponent } from './shared-patient-consultation.component';

describe('SharedPatientConsultationComponent', () => {
  let component: SharedPatientConsultationComponent;
  let fixture: ComponentFixture<SharedPatientConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedPatientConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPatientConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
