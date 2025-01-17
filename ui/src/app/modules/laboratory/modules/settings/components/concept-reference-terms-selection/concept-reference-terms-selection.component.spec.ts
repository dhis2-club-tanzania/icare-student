import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptReferenceTermsSelectionComponent } from './concept-reference-terms-selection.component';

describe('ConceptReferenceTermsSelectionComponent', () => {
  let component: ConceptReferenceTermsSelectionComponent;
  let fixture: ComponentFixture<ConceptReferenceTermsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptReferenceTermsSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptReferenceTermsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
