import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceduresHistorySummaryComponent } from './procedures-history-summary.component';

describe('ProceduresHistorySummaryComponent', () => {
  let component: ProceduresHistorySummaryComponent;
  let fixture: ComponentFixture<ProceduresHistorySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceduresHistorySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceduresHistorySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
