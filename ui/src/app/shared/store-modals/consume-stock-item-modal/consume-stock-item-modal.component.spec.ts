import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumeStockItemModalComponent } from './consume-stock-item-modal.component';

describe('ConsumeStockItemModalComponent', () => {
  let component: ConsumeStockItemModalComponent;
  let fixture: ComponentFixture<ConsumeStockItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumeStockItemModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumeStockItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
