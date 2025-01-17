import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultReviewModalComponent } from './result-review-modal.component';

describe('ResultReviewModalComponent', () => {
  let component: ResultReviewModalComponent;
  let fixture: ComponentFixture<ResultReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultReviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
