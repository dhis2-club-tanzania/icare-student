import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBatchTestordersSelectionComponent } from './shared-batch-testorders-selection.component';

describe('SharedBatchTestordersSelectionComponent', () => {
  let component: SharedBatchTestordersSelectionComponent;
  let fixture: ComponentFixture<SharedBatchTestordersSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedBatchTestordersSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBatchTestordersSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
