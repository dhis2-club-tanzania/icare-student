import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySampleStatusDashboardComponent } from './summary-sample-status-dashboard.component';

describe('SummarySampleStatusDashboardComponent', () => {
  let component: SummarySampleStatusDashboardComponent;
  let fixture: ComponentFixture<SummarySampleStatusDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySampleStatusDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySampleStatusDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
