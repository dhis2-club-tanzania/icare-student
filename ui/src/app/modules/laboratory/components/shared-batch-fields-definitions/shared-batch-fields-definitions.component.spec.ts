import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBatchFieldsDefinitionsComponent } from './shared-batch-fields-definitions.component';

describe('SharedBatchFieldsDefinitionsComponent', () => {
  let component: SharedBatchFieldsDefinitionsComponent;
  let fixture: ComponentFixture<SharedBatchFieldsDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedBatchFieldsDefinitionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBatchFieldsDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
