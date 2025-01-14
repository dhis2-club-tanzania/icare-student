import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultEntryByBatchHomeComponent } from './result-entry-by-batch-home.component';

describe('ResultEntryByBatchHomeComponent', () => {
  let component: ResultEntryByBatchHomeComponent;
  let fixture: ComponentFixture<ResultEntryByBatchHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultEntryByBatchHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultEntryByBatchHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
