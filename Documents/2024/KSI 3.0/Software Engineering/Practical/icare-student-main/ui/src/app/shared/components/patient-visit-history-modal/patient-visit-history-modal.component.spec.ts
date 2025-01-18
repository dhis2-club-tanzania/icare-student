import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVisitHistoryModalComponent } from './patient-visit-history-modal.component';

describe('PatientVisitHistoryModalComponent', () => {
  let component: PatientVisitHistoryModalComponent;
  let fixture: ComponentFixture<PatientVisitHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientVisitHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientVisitHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
