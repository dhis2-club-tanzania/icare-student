import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StockInvoiceItemsComponent } from "./stock-invoice-items.component";

describe("StockInvoiceItemsComponent", () => {
  let component: StockInvoiceItemsComponent;
  let fixture: ComponentFixture<StockInvoiceItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockInvoiceItemsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInvoiceItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
