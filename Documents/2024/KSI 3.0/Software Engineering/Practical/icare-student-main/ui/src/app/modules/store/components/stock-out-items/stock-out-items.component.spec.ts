import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutItemsComponent } from './stock-out-items.component';

describe('StockOutItemsComponent', () => {
  let component: StockOutItemsComponent;
  let fixture: ComponentFixture<StockOutItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockOutItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOutItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
