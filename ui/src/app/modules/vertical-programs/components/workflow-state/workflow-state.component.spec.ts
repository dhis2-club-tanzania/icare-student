import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowStateComponent } from './workflow-state.component';

describe('WorkflowStateComponent', () => {
  let component: WorkflowStateComponent;
  let fixture: ComponentFixture<WorkflowStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
