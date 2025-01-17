import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSourcesComponent } from './concept-sources.component';

describe('ConceptSourcesComponent', () => {
  let component: ConceptSourcesComponent;
  let fixture: ComponentFixture<ConceptSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptSourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
