import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDashboardChartItemComponent } from './shared-dashboard-chart-item.component';

describe('SharedDashboardChartItemComponent', () => {
  let component: SharedDashboardChartItemComponent;
  let fixture: ComponentFixture<SharedDashboardChartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDashboardChartItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedDashboardChartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
