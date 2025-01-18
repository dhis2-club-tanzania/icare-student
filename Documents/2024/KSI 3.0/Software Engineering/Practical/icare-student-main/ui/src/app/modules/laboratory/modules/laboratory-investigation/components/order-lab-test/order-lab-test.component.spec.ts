import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLabTestComponent } from './order-lab-test.component';

describe('OrderLabTestComponent', () => {
  let component: OrderLabTestComponent;
  let fixture: ComponentFixture<OrderLabTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderLabTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLabTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
