import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySampleCollectedComponent } from './summary-sample-collected.component';

describe('SummarySampleCollectedComponent', () => {
  let component: SummarySampleCollectedComponent;
  let fixture: ComponentFixture<SummarySampleCollectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySampleCollectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySampleCollectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
