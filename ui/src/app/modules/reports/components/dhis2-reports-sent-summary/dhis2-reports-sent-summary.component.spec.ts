import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dhis2ReportsSentSummaryComponent } from './dhis2-reports-sent-summary.component';

describe('Dhis2ReportsSentSummaryComponent', () => {
  let component: Dhis2ReportsSentSummaryComponent;
  let fixture: ComponentFixture<Dhis2ReportsSentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Dhis2ReportsSentSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Dhis2ReportsSentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
