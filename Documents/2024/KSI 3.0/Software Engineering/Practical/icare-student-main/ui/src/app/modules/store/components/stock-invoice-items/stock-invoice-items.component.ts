import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { LocationService } from "src/app/core/services";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { StockInvoicesService } from "src/app/shared/resources/store/services/stockInvoice.service";
import { SupplierService } from "src/app/shared/resources/store/services/supplier.service";
import { StockInvoiceFormDialogComponent } from "../../modals/stock-invoice-form-dialog/stock-invoice-form-dialog.component";
@Component({
  selector: "app-stock-invoice-items",
  templateUrl: "./stock-invoice-items.component.html",
  styleUrls: ["./stock-invoice-items.component.scss"],
})
export class StockInvoiceItemsComponent implements OnInit {
  @Input() stockInvoice: any;
  @Input() status: any;
  @Input() currentLocation: any;
  @Input() unitsOfMeasurementSettings: any;
  @Input() updateStockInvoice: any;
  @Output() reloadList: EventEmitter<any> = new EventEmitter();

  errors: any[];
  specificStockInvoice$: Observable<any>;
  unitsOfMeasurementSettings$: Observable<any>;
  loadingInvoice: boolean = false;
  constructor(
    private stockInvoicesService: StockInvoicesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadingInvoice = true;
    this.specificStockInvoice$ = this.stockInvoicesService
      .getStockInvoice(this.stockInvoice?.uuid)
      .pipe(
        tap(() => {
          this.loadingInvoice = false;
        })
      );
  }

  onUpdateStockInvoiceItem(stockInvoiceItem, key: string) {
    if (!key) {
      this.dialog
        .open(StockInvoiceFormDialogComponent, {
          width: "80%",
          data: {
            stockInvoiceItem: stockInvoiceItem,
            unitsOfMeasurementSettings: this.unitsOfMeasurementSettings,
            currentLocation: this.currentLocation,
          },
        })
        .afterClosed()
        .subscribe(() => {
          this.reloadList.emit(this.stockInvoice);
        });
    }
    if (key === "receive") {
      this.dialog
        .open(SharedConfirmationComponent, {
          width: "25%",
          data: {
            modalTitle: "Are you sure to receive this Item",
            modalMessage:
              "After receiving an item you won't be able to update it, hence this action is irreversible. Please, click confirm to receive and click cancel to stop this action.",
          },
        })
        .afterClosed()
        .subscribe((data) => {
          if (data?.confirmed) {
            const invoicesItemObject = {
              ...stockInvoiceItem,
              location: {
                uuid: this.currentLocation?.uuid,
              },
              expiryDate: new Date(stockInvoiceItem?.expiryDate).toISOString(),
              stockInvoiceItemStatus: [
                {
                  status: "RECEIVED",
                },
              ],
            };

            this.stockInvoicesService
              .updateStockInvoiceItem(
                stockInvoiceItem?.uuid,
                invoicesItemObject
              )
              .pipe(
                tap((response) => {
                  this.reloadList.emit(this.stockInvoice);
                })
              )
              .subscribe();
          }
        });
    }

    if (key === "delete") {
      this.dialog
        .open(SharedConfirmationComponent, {
          width: "25%",
          data: {
            modalTitle: "Are you sure to delete this Item",
            modalMessage:
              "This action is irreversible. Please, click confirm to delete and click cancel to cancel deletion.",
          },
        })
        .afterClosed()
        .subscribe((data) => {
          if (data?.confirmed) {
            const invoicesItemObject = {
              ...stockInvoiceItem,
              location: {
                uuid: this.currentLocation?.uuid,
              },
              voided: true,
            };

            this.stockInvoicesService
              .updateStockInvoiceItem(
                stockInvoiceItem?.uuid,
                invoicesItemObject
              )
              .pipe(
                tap((response) => {
                  this.reloadList.emit(this.stockInvoice);
                })
              )
              .subscribe();
          }
          this.reloadList.emit(this.stockInvoice);
        });
    }
  }
}
