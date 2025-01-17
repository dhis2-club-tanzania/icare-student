/* tslint:disable:no-unused-variable */

import { TestBed } from "@angular/core/testing";
import { StockInvoicesService } from "./stockInvoice.service";


describe("StockInvoicesService", () => {
  let service: StockInvoicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockInvoicesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
