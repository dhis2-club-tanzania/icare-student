import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBatchSamplesListEntryComponent } from './shared-batch-samples-list-entry.component';

describe('SharedBatchSamplesListEntryComponent', () => {
  let component: SharedBatchSamplesListEntryComponent;
  let fixture: ComponentFixture<SharedBatchSamplesListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedBatchSamplesListEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBatchSamplesListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
