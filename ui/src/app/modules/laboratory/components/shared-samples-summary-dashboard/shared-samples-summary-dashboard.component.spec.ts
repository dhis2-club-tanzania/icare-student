import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSamplesSummaryDashboardComponent } from './shared-samples-summary-dashboard.component';

describe('SharedSamplesSummaryDashboardComponent', () => {
  let component: SharedSamplesSummaryDashboardComponent;
  let fixture: ComponentFixture<SharedSamplesSummaryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSamplesSummaryDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSamplesSummaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
