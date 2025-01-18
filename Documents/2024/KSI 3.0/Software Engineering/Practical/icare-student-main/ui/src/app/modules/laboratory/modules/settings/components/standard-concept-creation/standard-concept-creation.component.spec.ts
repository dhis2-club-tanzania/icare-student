import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardConceptCreationComponent } from './standard-concept-creation.component';

describe('StandardConceptCreationComponent', () => {
  let component: StandardConceptCreationComponent;
  let fixture: ComponentFixture<StandardConceptCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardConceptCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardConceptCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
