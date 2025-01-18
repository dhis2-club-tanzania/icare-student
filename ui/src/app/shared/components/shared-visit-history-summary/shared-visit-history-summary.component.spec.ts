import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedVisitHistorySummaryComponent } from './shared-visit-history-summary.component';

describe('SharedVisitHistorySummaryComponent', () => {
  let component: SharedVisitHistorySummaryComponent;
  let fixture: ComponentFixture<SharedVisitHistorySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedVisitHistorySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedVisitHistorySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
