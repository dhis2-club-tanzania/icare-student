import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedConceptCreateComponent } from './shared-concept-create.component';

describe('SharedConceptCreateComponent', () => {
  let component: SharedConceptCreateComponent;
  let fixture: ComponentFixture<SharedConceptCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedConceptCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedConceptCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
