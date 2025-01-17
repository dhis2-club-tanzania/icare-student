import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StockInvoicesListComponent } from "./stock-invoices-list.component";

describe("StockInvoicesListComponent", () => {
  let component: StockInvoicesListComponent;
  let fixture: ComponentFixture<StockInvoicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockInvoicesListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInvoicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
