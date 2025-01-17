import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientObservationsChartComponent } from './patient-observations-chart.component';

describe('PatientObservationsChartComponent', () => {
  let component: PatientObservationsChartComponent;
  let fixture: ComponentFixture<PatientObservationsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientObservationsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientObservationsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
