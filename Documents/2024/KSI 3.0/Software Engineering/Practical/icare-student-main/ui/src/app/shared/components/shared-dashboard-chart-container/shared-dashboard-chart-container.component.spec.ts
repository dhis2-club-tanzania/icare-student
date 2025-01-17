import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDashboardChartContainerComponent } from './shared-dashboard-chart-container.component';

describe('SharedDashboardChartContainerComponent', () => {
  let component: SharedDashboardChartContainerComponent;
  let fixture: ComponentFixture<SharedDashboardChartContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDashboardChartContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDashboardChartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
