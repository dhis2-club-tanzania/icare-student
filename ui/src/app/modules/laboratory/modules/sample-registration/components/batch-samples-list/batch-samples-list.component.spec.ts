import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSamplesListComponent } from './batch-samples-list.component';

describe('BatchSamplesListComponent', () => {
  let component: BatchSamplesListComponent;
  let fixture: ComponentFixture<BatchSamplesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchSamplesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSamplesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
