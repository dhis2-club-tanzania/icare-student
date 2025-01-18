import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptReferenceTermsComponent } from './concept-reference-terms.component';

describe('ConceptReferenceTermsComponent', () => {
  let component: ConceptReferenceTermsComponent;
  let fixture: ComponentFixture<ConceptReferenceTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptReferenceTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptReferenceTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
