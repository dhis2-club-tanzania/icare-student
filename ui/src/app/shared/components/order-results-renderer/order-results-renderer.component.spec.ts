import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderResultsRendererComponent } from './order-results-renderer.component';

describe('OrderResultsRendererComponent', () => {
  let component: OrderResultsRendererComponent;
  let fixture: ComponentFixture<OrderResultsRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderResultsRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderResultsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
