import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleResultsEntryComponent } from './multiple-results-entry.component';

describe('MultipleResultsEntryComponent', () => {
  let component: MultipleResultsEntryComponent;
  let fixture: ComponentFixture<MultipleResultsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleResultsEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleResultsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
