import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsWorkflowsAndFormsRelationshipComponent } from './programs-workflows-and-forms-relationship.component';

describe('ProgramsWorkflowsAndFormsRelationshipComponent', () => {
  let component: ProgramsWorkflowsAndFormsRelationshipComponent;
  let fixture: ComponentFixture<ProgramsWorkflowsAndFormsRelationshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramsWorkflowsAndFormsRelationshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsWorkflowsAndFormsRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
