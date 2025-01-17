import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleItemsSelectionComponent } from './multiple-items-selection.component';

describe('MultipleItemsSelectionComponent', () => {
  let component: MultipleItemsSelectionComponent;
  let fixture: ComponentFixture<MultipleItemsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleItemsSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleItemsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
