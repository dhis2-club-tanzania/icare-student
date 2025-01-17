import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTestsSelectionComponent } from './multiple-tests-selection.component';

describe('MultipleTestsSelectionComponent', () => {
  let component: MultipleTestsSelectionComponent;
  let fixture: ComponentFixture<MultipleTestsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleTestsSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTestsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
