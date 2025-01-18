import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleConceptsSelectionComponent } from './multiple-concepts-selection.component';

describe('MultipleConceptsSelectionComponent', () => {
  let component: MultipleConceptsSelectionComponent;
  let fixture: ComponentFixture<MultipleConceptsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleConceptsSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleConceptsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
