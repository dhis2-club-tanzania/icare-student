import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalizeStockUnitsQuantityComponent } from './totalize-stock-units-quantity.component';

describe('TotalizeStockUnitsQuantityComponent', () => {
  let component: TotalizeStockUnitsQuantityComponent;
  let fixture: ComponentFixture<TotalizeStockUnitsQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalizeStockUnitsQuantityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalizeStockUnitsQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
