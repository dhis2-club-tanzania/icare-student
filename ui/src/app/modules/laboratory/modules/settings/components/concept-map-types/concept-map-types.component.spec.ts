import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptMapTypesComponent } from './concept-map-types.component';

describe('ConceptMapTypesComponent', () => {
  let component: ConceptMapTypesComponent;
  let fixture: ComponentFixture<ConceptMapTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptMapTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptMapTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
