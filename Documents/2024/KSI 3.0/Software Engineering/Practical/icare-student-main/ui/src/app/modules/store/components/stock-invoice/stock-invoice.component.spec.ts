import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StockInvoiceComponent } from "./stock-invoice.component";

describe("StockInvoiceComponent", () => {
  let component: StockInvoiceComponent;
  let fixture: ComponentFixture<StockInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockInvoiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
