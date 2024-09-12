import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBatchFormComponent } from './shared-batch-form.component';

describe('SharedBatchFormComponent', () => {
  let component: SharedBatchFormComponent;
  let fixture: ComponentFixture<SharedBatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedBatchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
