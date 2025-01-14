import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceListItemsContainerComponent } from './price-list-items-container.component';

describe('PriceListItemsContainerComponent', () => {
  let component: PriceListItemsContainerComponent;
  let fixture: ComponentFixture<PriceListItemsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceListItemsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceListItemsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
