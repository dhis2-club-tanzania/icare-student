import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSetMembersComponent } from './concept-set-members.component';

describe('ConceptSetMembersComponent', () => {
  let component: ConceptSetMembersComponent;
  let fixture: ComponentFixture<ConceptSetMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptSetMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptSetMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
