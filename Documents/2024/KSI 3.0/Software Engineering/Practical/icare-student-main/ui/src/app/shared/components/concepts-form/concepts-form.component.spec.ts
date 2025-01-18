import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptsFormComponent } from './concepts-forms.component';

describe("ConceptsFormComponent", () => {
  let component: ConceptsFormComponent;
  let fixture: ComponentFixture<ConceptsFormComponent>;
  ConceptsFormComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConceptsFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
