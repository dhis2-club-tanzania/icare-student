import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedTestParametersEntryComponent } from './related-test-parameters-entry.component';

describe('RelatedTestParametersEntryComponent', () => {
  let component: RelatedTestParametersEntryComponent;
  let fixture: ComponentFixture<RelatedTestParametersEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedTestParametersEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedTestParametersEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
