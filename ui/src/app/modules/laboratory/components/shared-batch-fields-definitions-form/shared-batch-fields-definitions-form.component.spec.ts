import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBatchFieldsDefinitionsFormComponent } from './shared-batch-fields-definitions-form.component';

describe('SharedBatchFieldsDefinitionsFormComponent', () => {
  let component: SharedBatchFieldsDefinitionsFormComponent;
  let fixture: ComponentFixture<SharedBatchFieldsDefinitionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedBatchFieldsDefinitionsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBatchFieldsDefinitionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
