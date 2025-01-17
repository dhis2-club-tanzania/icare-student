import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleStatusSummaryForHomeComponent } from './sample-status-summary-for-home.component';

describe('SampleStatusSummaryForHomeComponent', () => {
  let component: SampleStatusSummaryForHomeComponent;
  let fixture: ComponentFixture<SampleStatusSummaryForHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleStatusSummaryForHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleStatusSummaryForHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
