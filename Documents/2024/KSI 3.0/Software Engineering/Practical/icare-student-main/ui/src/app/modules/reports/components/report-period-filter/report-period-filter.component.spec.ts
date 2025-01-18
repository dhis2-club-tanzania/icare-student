import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPeriodFilterComponent } from './report-period-filter.component';

describe('ReportPeriodFilterComponent', () => {
  let component: ReportPeriodFilterComponent;
  let fixture: ComponentFixture<ReportPeriodFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPeriodFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPeriodFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
