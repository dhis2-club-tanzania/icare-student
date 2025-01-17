import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSentHistoryModalComponent } from './report-sent-history-modal.component';

describe('ReportSentHistoryModalComponent', () => {
  let component: ReportSentHistoryModalComponent;
  let fixture: ComponentFixture<ReportSentHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSentHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSentHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
