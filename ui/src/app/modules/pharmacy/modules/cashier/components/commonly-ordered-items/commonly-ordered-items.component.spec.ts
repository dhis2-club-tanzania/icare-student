import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonlyOrderedItemsComponent } from './commonly-ordered-items.component';

describe('CommonlyOrderedItemsComponent', () => {
  let component: CommonlyOrderedItemsComponent;
  let fixture: ComponentFixture<CommonlyOrderedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonlyOrderedItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonlyOrderedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
