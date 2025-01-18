import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRenderReportDashboardComponent } from './shared-render-report-dashboard.component';

describe('SharedRenderReportDashboardComponent', () => {
  let component: SharedRenderReportDashboardComponent;
  let fixture: ComponentFixture<SharedRenderReportDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedRenderReportDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRenderReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
