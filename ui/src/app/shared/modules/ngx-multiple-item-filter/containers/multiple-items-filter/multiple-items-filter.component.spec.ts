import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleItemsFilterComponent } from './multiple-items-filter.component';

describe('MultipleItemsFilterComponent', () => {
  let component: MultipleItemsFilterComponent;
  let fixture: ComponentFixture<MultipleItemsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleItemsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleItemsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
