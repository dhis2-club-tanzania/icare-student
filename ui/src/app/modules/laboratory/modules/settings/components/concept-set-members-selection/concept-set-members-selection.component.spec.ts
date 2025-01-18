import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSetMembersSelectionComponent } from './concept-set-members-selection.component';

describe('ConceptSetMembersSelectionComponent', () => {
  let component: ConceptSetMembersSelectionComponent;
  let fixture: ComponentFixture<ConceptSetMembersSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptSetMembersSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptSetMembersSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
