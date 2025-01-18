import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersOptionsFormComponent } from './orders-options-form.component';

describe('OrdersOptionsFormComponent', () => {
  let component: OrdersOptionsFormComponent;
  let fixture: ComponentFixture<OrdersOptionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersOptionsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersOptionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
