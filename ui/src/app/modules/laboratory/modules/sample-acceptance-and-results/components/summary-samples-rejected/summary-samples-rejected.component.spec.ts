import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySamplesRejectedComponent } from './summary-samples-rejected.component';

describe('SummarySamplesRejectedComponent', () => {
  let component: SummarySamplesRejectedComponent;
  let fixture: ComponentFixture<SummarySamplesRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySamplesRejectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySamplesRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
