import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowStateFormDataComponent } from './workflow-state-form-data.component';

describe('WorkflowStateFormDataComponent', () => {
  let component: WorkflowStateFormDataComponent;
  let fixture: ComponentFixture<WorkflowStateFormDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowStateFormDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowStateFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
