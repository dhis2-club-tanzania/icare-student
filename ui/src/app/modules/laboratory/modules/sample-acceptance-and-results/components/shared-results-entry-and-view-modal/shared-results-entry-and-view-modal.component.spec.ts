import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedResultsEntryAndViewModalComponent } from './shared-results-entry-and-view-modal.component';

describe('SharedResultsEntryAndViewModalComponent', () => {
  let component: SharedResultsEntryAndViewModalComponent;
  let fixture: ComponentFixture<SharedResultsEntryAndViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedResultsEntryAndViewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedResultsEntryAndViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
