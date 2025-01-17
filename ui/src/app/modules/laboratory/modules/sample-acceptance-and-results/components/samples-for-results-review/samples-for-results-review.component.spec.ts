import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesForResultsReviewComponent } from './samples-for-results-review.component';

describe('SamplesForResultsReviewComponent', () => {
  let component: SamplesForResultsReviewComponent;
  let fixture: ComponentFixture<SamplesForResultsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplesForResultsReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesForResultsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
