import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedResultsHistoryComponent } from './related-results-history.component';

describe('RelatedResultsHistoryComponent', () => {
  let component: RelatedResultsHistoryComponent;
  let fixture: ComponentFixture<RelatedResultsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedResultsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedResultsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
