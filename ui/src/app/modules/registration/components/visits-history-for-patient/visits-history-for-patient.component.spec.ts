import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitsHistoryForPatientComponent } from './visits-history-for-patient.component';

describe('VisitsHistoryForPatientComponent', () => {
  let component: VisitsHistoryForPatientComponent;
  let fixture: ComponentFixture<VisitsHistoryForPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitsHistoryForPatientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitsHistoryForPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
