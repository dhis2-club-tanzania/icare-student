import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySamplesWithResultsComponent } from './summary-samples-with-results.component';

describe('SummarySamplesWithResultsComponent', () => {
  let component: SummarySamplesWithResultsComponent;
  let fixture: ComponentFixture<SummarySamplesWithResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarySamplesWithResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySamplesWithResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
