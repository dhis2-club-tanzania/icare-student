import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBatchSetFormComponent } from './shared-batch-set-form.component';

describe('SharedBatchSetFormComponent', () => {
  let component: SharedBatchSetFormComponent;
  let fixture: ComponentFixture<SharedBatchSetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedBatchSetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBatchSetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
