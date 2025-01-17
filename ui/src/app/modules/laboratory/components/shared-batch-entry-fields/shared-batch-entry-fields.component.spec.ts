import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBatchEntryFieldsComponent } from './shared-batch-entry-fields.component';

describe('SharedBatchEntryFieldsComponent', () => {
  let component: SharedBatchEntryFieldsComponent;
  let fixture: ComponentFixture<SharedBatchEntryFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedBatchEntryFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBatchEntryFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
