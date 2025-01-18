import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAssociatedFieldResultsEntryComponent } from './shared-associated-field-results-entry.component';

describe('SharedAssociatedFieldResultsEntryComponent', () => {
  let component: SharedAssociatedFieldResultsEntryComponent;
  let fixture: ComponentFixture<SharedAssociatedFieldResultsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedAssociatedFieldResultsEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAssociatedFieldResultsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
