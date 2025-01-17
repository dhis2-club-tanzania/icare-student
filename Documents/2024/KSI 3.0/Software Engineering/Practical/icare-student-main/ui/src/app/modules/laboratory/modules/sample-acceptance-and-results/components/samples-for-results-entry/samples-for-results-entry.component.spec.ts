import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesForResultsEntryComponent } from './samples-for-results-entry.component';

describe('SamplesForResultsEntryComponent', () => {
  let component: SamplesForResultsEntryComponent;
  let fixture: ComponentFixture<SamplesForResultsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplesForResultsEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesForResultsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
