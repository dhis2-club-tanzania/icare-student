import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationChartTableComponent } from './observation-chart-table.component';

describe('ObservationChartTableComponent', () => {
  let component: ObservationChartTableComponent;
  let fixture: ComponentFixture<ObservationChartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservationChartTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationChartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
