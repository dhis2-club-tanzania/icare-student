/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StockInvoiceFormDialogComponent } from './stock-invoice-form-dialog.component';

describe("StockInvoiceFormDialogComponent", () => {
  let component: StockInvoiceFormDialogComponent;
  let fixture: ComponentFixture<StockInvoiceFormDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StockInvoiceFormDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInvoiceFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
