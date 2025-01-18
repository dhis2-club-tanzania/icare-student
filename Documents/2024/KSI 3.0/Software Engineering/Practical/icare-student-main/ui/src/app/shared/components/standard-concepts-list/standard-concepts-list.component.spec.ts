import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardConceptsListComponent } from './standard-concepts-list.component';

describe('StandardConceptsListComponent', () => {
  let component: StandardConceptsListComponent;
  let fixture: ComponentFixture<StandardConceptsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardConceptsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardConceptsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
