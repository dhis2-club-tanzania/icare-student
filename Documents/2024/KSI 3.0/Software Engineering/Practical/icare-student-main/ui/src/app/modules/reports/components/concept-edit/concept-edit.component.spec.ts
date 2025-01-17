import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptEditComponent } from './concept-edit.component';

describe('ConceptEditComponent', () => {
  let component: ConceptEditComponent;
  let fixture: ComponentFixture<ConceptEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
