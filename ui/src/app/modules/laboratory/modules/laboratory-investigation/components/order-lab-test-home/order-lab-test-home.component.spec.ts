import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLabTestHomeComponent } from './order-lab-test-home.component';

describe('OrderLabTestHomeComponent', () => {
  let component: OrderLabTestHomeComponent;
  let fixture: ComponentFixture<OrderLabTestHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderLabTestHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLabTestHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
