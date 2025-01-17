import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySamplePendingComponent } from './summary-sample-pending.component';

describe('SummarySamplePendingComponent', () => {
  let component: SummarySamplePendingComponent;
  let fixture: ComponentFixture<SummarySamplePendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySamplePendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySamplePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
