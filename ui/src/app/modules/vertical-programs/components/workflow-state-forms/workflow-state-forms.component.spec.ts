import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowStateFormsComponent } from './workflow-state-forms.component';

describe('WorkflowStateFormsComponent', () => {
  let component: WorkflowStateFormsComponent;
  let fixture: ComponentFixture<WorkflowStateFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowStateFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowStateFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
