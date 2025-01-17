import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageConceptAttributesComponent } from './manage-concept-attributes.component';

describe('ManageConceptAttributesComponent', () => {
  let component: ManageConceptAttributesComponent;
  let fixture: ComponentFixture<ManageConceptAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageConceptAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageConceptAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
