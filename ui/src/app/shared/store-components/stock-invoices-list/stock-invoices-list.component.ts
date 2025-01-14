import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { StockInvoicesService } from "src/app/shared/resources/store/services/stockInvoice.service";
import { StockInvoiceFormDialogComponent } from "../../store-modals/stock-invoice-form-dialog/stock-invoice-form-dialog.component";

@Component({
  selector: "app-stock-invoices-list",
  templateUrl: "./stock-invoices-list.component.html",
  styleUrls: ["./stock-invoices-list.component.scss"],
})
export class StockInvoicesListComponent implements OnInit {
  @Input() status: any;
  @Input() currentLocation: any;

  errors: any[];
  stockInvoices$: Observable<any>;
  loading: boolean = false;
  viewStockInvoiceItems: any;
  pageSize: number = 10;
  page: number = 1;
  pager: number;
  pageSizeOptions: number[] = [5, 10, 15, 25, 50];
  q: string;
  startDate: Date;
  endDate: Date;
  constructor(
    private stockInvoicesService: StockInvoicesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getInvoices();
  }

  onGetSearchingText(q: string): void {
    this.q = q;
    this.getInvoices();
  }

  onGetEndDate(endDate: Date): void {
    this.endDate = endDate;
    this.getInvoices();
  }

  onGetStartDate(startDate: Date): void {
    this.startDate = startDate;
    this.getInvoices();
  }

  getInvoices() {
    this.loading = true;
    this.stockInvoices$ = this.stockInvoicesService
      .getStockInvoices(this.page, this.pageSize, this.status, null, {
        q: this.q,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .pipe(
        map((response) => {
          this.loading = false;
          if (!response?.error) {
            this.pager = response?.pager;
            return response;
          }
          if (response?.error) {
            this.errors = [...this.errors, response.error];
          }
        }),
        tap((result) =>
          result.results.sort((a, b) =>
            a.receivingDate > b.receivingDate ? -1 : 1
          )
        )
      );
  }

  onEditStockInvoice(stockInvoice) {
    this.dialog
      .open(StockInvoiceFormDialogComponent, {
        width: "80%",
        data: {
          stockInvoice: stockInvoice,
          currentLocation: this.currentLocation,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.getInvoices();
      });
  }

  onReceiveStockInvoiceItems(stockInvoice) {
    this.dialog
      .open(SharedConfirmationComponent, {
        minWidth: "25%",
        data: {
          modalTitle: "Are you sure to receive all items in this invoice?",
          modalMessage:
            "This action is irreversible. Please, click confirm to reveice all items in this invoice and click cancel to stop the action.",
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data?.confirmed) {
          const stockInvoiceObject = {
            ...stockInvoice,
            receivingDate: new Date(stockInvoice?.receivingDate).toISOString(),
            stockInvoiceStatus: [
              {
                status: "RECEIVED",
              },
            ],
          };

          this.stockInvoicesService
            .updateStockInvoice(stockInvoice?.uuid, stockInvoiceObject)
            .pipe(
              tap((response) => {
                this.getInvoices();
              })
            )
            .subscribe();
        }
      });
  }

  onViewStockInvoiceItems(stockInvoiceUuid) {
    if (stockInvoiceUuid === this.viewStockInvoiceItems) {
      this.viewStockInvoiceItems = undefined;
    } else {
      this.viewStockInvoiceItems = stockInvoiceUuid;
    }
  }

  onDeleteStockInvoice(stockInvoice) {
    this.dialog
      .open(SharedConfirmationComponent, {
        minWidth: "25%",
        data: {
          modalTitle: "Are you sure to delete this stock invoice?",
          modalMessage:
            "This action is irreversible. Please, click confirm to delete stock invoice and click cancel to stop the action.",
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data?.confirmed) {
          // const stockInvoiceObject = {
          //   ...stockInvoice,
          //   receivingDate: new Date(stockInvoice?.receivingDate).toISOString(),
          //   voided: true,
          // };

          this.stockInvoicesService
            .deleteStockInvoice(stockInvoice?.uuid)
            .pipe(
              tap((response) => {
                this.getInvoices();
              })
            )
            .subscribe();
        }
      });
  }

  onReloadStockInvoiceList(stockInvoice) {
    this.viewStockInvoiceItems = undefined;
    this.getInvoices();
    setTimeout(() => {
      this.viewStockInvoiceItems = stockInvoice?.uuid;
    }, 100);
  }

  onPageChange(event) {
    this.page =
      event.pageIndex - this.page >= 0 ? this.page + 1 : this.page - 1;
    this.pageSize = Number(event?.pageSize);
    this.getInvoices();
  }
}
