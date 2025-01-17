import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVisitsHistoryComponent } from './patient-visits-history.component';

describe('PatientVisitsHistoryComponent', () => {
  let component: PatientVisitsHistoryComponent;
  let fixture: ComponentFixture<PatientVisitsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientVisitsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientVisitsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
