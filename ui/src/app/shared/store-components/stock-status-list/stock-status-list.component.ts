import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { LocationService } from "src/app/core/services";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { LocationGet } from "src/app/shared/resources/openmrs";
import { LedgerInput } from "src/app/shared/resources/store/models/ledger-input.model";
import { StockObject } from "src/app/shared/resources/store/models/stock.model";
import { StockService } from "src/app/shared/resources/store/services/stock.service";
import { formatDateToString } from "src/app/shared/helpers/format-date.helper";
import { getParentLocation } from "src/app/store/selectors";
import { AppState } from "src/app/store/reducers";
import { Store, select } from "@ngrx/store";
import { getCurrentUserDetails } from "src/app/store/selectors/current-user.selectors";
import { AddNewStockReceivedComponent } from "../../store-modals/add-new-stock-received/add-new-stock-received.component";
import { ConsumeStockItemModalComponent } from "../../store-modals/consume-stock-item-modal/consume-stock-item-modal.component";
import { sortBy } from "lodash";
import { ExportDataService } from "src/app/core/services/export-data.service";
@Component({
  selector: "app-stock-status-list",
  templateUrl: "./stock-status-list.component.html",
  styleUrls: ["./stock-status-list.component.scss"],
})
export class StockStatusListComponent implements OnInit {
  @Input() currentLocation: LocationGet;
  @Input() ledgerTypes: any[];
  @Input() userPrivileges: any;
  @Input() isCurrentLocationMainStore: boolean;
  @Input() isCurrentLocationPharmacy: boolean;
  @Input() isStockOutPage: boolean;
  @Input() status: string;
  stocksList$: Observable<StockObject[]>;
  searchTerm: string;
  currentItemStock: StockObject;
  currentItemStocks$: Observable<StockObject>;
  currentItemStock$: Observable<StockObject>;
  saving: boolean = false;
  itemID?: string;
  showReceivingForm?: boolean;
  errors: any[] = [];
  suppliers$: Observable<any>;
  unitsOfMeasurementSettings$: Observable<any>;
  unitsOfMeasurement$: Observable<any>;
  pageSize: number = 15;
  page: number = 1;
  pager: number;
  pageSizeOptions: number[] = [5, 10, 15, 25, 50, 100];
  consumeLedgerUuid$: Observable<string>;
  facilityDetails$: Observable<any>;
  currentUser$: Observable<any>;
  constructor(
    private stockService: StockService,
    private dialog: MatDialog,
    private systemSettingsService: SystemSettingsService,
    private store: Store<AppState>,
    private exportDataService: ExportDataService
  ) {}

  ngOnInit(): void {
    this.facilityDetails$ = this.store.select(getParentLocation);
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    //  console.log("trace is status---------------------",this.status)
    this.consumeLedgerUuid$ = this.systemSettingsService.getSystemSettingsByKey(
      `icare.store.settings.consumeLedger.ledgerTypeUuid`
    );
    this.consumeLedgerUuid$.subscribe((response: any) => {
      if (response?.error) {
        this.errors = [...this.errors, response];
      } else if (response === "none") {
        this.errors = [
          ...this.errors,
          {
            error: {
              error:
                "icare.store.settings.consumeLedger.ledgerTypeUuid does not exist, contact IT",
              message:
                "icare.store.settings.consumeLedger.ledgerTypeUuid does not exist, contact IT",
            },
          },
        ];
      }
    });
    this.getStock();
  }

  searchStock(event: any): void {
    this.searchTerm = event.target?.value;
    setTimeout(() => {
      this.getStock();
    }, 200);
  }

  onAddNewStockRecevied(
    event: Event,
    ledgerTypes: any[],
    currentStore: LocationGet
  ): void {
    event.stopPropagation();
    this.dialog
      .open(AddNewStockReceivedComponent, {
        width: "700px",
        data: {
          ledgerTypes,
          currentStore,
        },
      })
      .afterClosed()
      .subscribe((shouldReloadStock) => {
        if (shouldReloadStock) {
        }
      });
  }

  getStock(): void {
    if (!this.isStockOutPage && !this.status) {
      this.stocksList$ = this.stockService
        .getAvailableStocks(
          this.currentLocation?.uuid,
          { q: this.searchTerm },
          this.page,
          this.pageSize
        )
        .pipe(
          map((response) => {
            this.pager = response?.pager;
            return sortBy(response?.results, (stock) => stock?.name);
          })
        );
    } else if (this.isStockOutPage) {
      this.stocksList$ = this.stockService
        .getStockOuts(
          this.currentLocation?.uuid,
          { q: this.searchTerm },
          this.page,
          this.pageSize
        )
        .pipe(
          map((response) => {
            this.pager = response?.pager;
            return sortBy(response?.results, (stock) => stock?.name);
          })
        );
    } else if (this.status === "EXPIRED") {
      this.stocksList$ = this.stockService
        .getExpiredItems(
          this.currentLocation?.uuid,
          { q: this.searchTerm },
          this.page,
          this.pageSize
        )
        .pipe(
          map((response) => {
            this.pager = response?.pager;
            return sortBy(response?.results, (stock) => stock?.name);
          })
        );
    } else if (this.status === "NEARLYSTOCKEDOUT") {
      this.stocksList$ = this.stockService
        .getNearlyStockedOutItems(
          this.currentLocation?.uuid,
          { q: this.searchTerm },
          this.page,
          this.pageSize
        )
        .pipe(
          map((response) => {
            this.pager = response?.pager;
            return sortBy(response?.results, (stock) => stock?.name);
          })
        );
    } else if (this.status === "NEARLYEXPIRED") {
      this.stocksList$ = this.stockService
        .getNearlyExpiredItems(
          this.currentLocation?.uuid,
          { q: this.searchTerm },
          this.page,
          this.pageSize
        )
        .pipe(
          map((response) => {
            this.pager = response?.pager;
            return sortBy(response?.results, (stock) => stock?.name);
          })
        );
    }
  }

  onToggleCurrentStock(event: Event, stock: StockObject): void {
    if (event) {
      event.stopPropagation();
      this.currentItemStock$ = this.stockService.getAvailableStockOfAnItem(
        stock?.id,
        this.currentLocation?.uuid
      );
    } else {
      this.currentItemStock$ = of(null);
      this.getStock();
    }
  }
  onSaveLedger(ledgerInput: LedgerInput, currentStock: any): void {
    this.saving = true;
    this.stockService.saveStockLedger(ledgerInput).subscribe((response) => {
      if (!response?.error) {
        this.saving = false;
        this.currentItemStock$ = this.stockService.getAvailableStockOfAnItem(
          currentStock?.id,
          this.currentLocation?.uuid
        );
      }
      if (response?.error) {
        this.errors = [...this.errors, response?.error];
      }
    });
  }
  onViewStockStatus(event: Event, itemID): void {
    if (event) {
      event.stopPropagation();
      this.itemID = itemID;
    }
  }
  onClearItemID() {
    this.itemID = undefined;
  }

  onHideReceivingForm(e: any) {
    e.stopPropagation();
    this.showReceivingForm = false;
  }

  onShowReceivingForm(e: any) {
    e.stopPropagation();
    this.showReceivingForm = true;
  }

  onPageChange(event) {
    // this.page =
    //   event.pageIndex - this.page >= 0 ? this.page + 1 : this.page - 1;
    this.page = this.page + (event?.pageIndex - event?.previousPageIndex);
    this.pageSize = Number(event?.pageSize);
    // console.log("pagesize --------------------------------->", this.pageSize );
    this.getStock();
  }

  onOpenConsumeModal(
    currentItemStock: any,
    consumeLedgerUuid: string,
    ledgerTypes: any[],
    currentLocation: any
  ): void {
    this.dialog
      .open(ConsumeStockItemModalComponent, {
        minWidth: "40%",
        data: {
          currentItemStock,
          currentLocation,
          ledger: (ledgerTypes?.filter(
            (ledger) =>
              (ledger?.id ? ledger?.id : ledger?.uuid) === consumeLedgerUuid
          ) || [])[0],
        },
      })
      .afterClosed()
      .subscribe((shouldReload: boolean) => {
        if (shouldReload) {
          this.getStock();
        }
      });
  }

  onDownloadXLS(e: Event, param: any, facilityDetails: any, currentUser: any) {
    let excelData = param.map((data) => {
      return {
        name: data?.display,
        quantity: data?.quantity,
        eligibleQuantity: data?.eligibleQuantity,
        location: this.currentLocation?.display,
      };
    });

    if (excelData) {
      this.exportDataService.exportAsExcelFile(
        excelData,
        this.currentLocation?.display
      );
    }
  }

  onPrint(e: Event, param: any, facilityDetails: any, currentUser: any) {
    let title: string;
    if (!this.isStockOutPage && !this.status) {
      title = "Available Stock";
    } else if (this.isStockOutPage) {
      title = "Stocked Out Items";
    } else if (this.status === "EXPIRED") {
      title = "Expired Items";
    } else if (this.status === "NEARLYSTOCKEDOUT") {
      title = "Neary Stocked Out Items";
    } else if (this.status === "NEARLYEXPIRED") {
      title = "Neary Expired Items";
    }

    let contents: string;
    let printingDate = formatDateToString(new Date());

    const frame1: any = document.createElement("iframe");
    frame1.name = "frame3";
    frame1.style.position = "absolute";
    frame1.style.width = "100%";
    frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);

    var frameDoc = frame1.contentWindow
      ? frame1.contentWindow
      : frame1.contentDocument.document
      ? frame1.contentDocument.document
      : frame1.contentDocument;

    frameDoc.document.open();

    frameDoc.document.write(`
         <html>
          <head>
            <style>
                @page { size: auto;  margin: 0mm; }

                body {
                  padding: 30px;
                  margin: 0 auto;
                  width: 150mm;
                }

                #top .logo img{
                  //float: left;
                  height: 100px;
                  width: 100px;
                  background-size: 100px 100px;
                }
                .info h2 {
                  font-size: 1.3em;
                }
                h3 {
                  font-size: 1em;
                }
                h5 {
                  font-size: .7em;
                }
                p {
                  font-size: .7em;
                }
                #table {
                  font-family: Arial, Helvetica, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
                  background-color: #000;
                }
                #table td, #table  th {
                  border: 1px solid #ddd;
                  padding: 5px;
                }

                #table tbody tr:nth-child(even){
                  background-color: #f2f2f2;
                }

                #table thead tr th {
                  padding-top:6px;
                  padding-bottom: 6px;
                  text-align: left;
                  background-color: #cecece;
                  font-size: .7em;
                }
                tbody tr td {
                  font-size: .7em;
                }
                .footer {
                  margin-top:50px
                }
                .footer .userDetails .signature {
                  margin-top: 20px;
                }
            </style>
          </head>
          <body>
           <div id="printOut">
          `);

    // Change image from base64 then replace some text with empty string to get an image

    let image = "";
    let header = "";
    let subHeader = "";

    facilityDetails?.attributes?.map((attribute) => {
      let attributeTypeName =
        attribute && attribute.attributeType
          ? attribute?.attributeType?.name.toLowerCase()
          : "";
      if (attributeTypeName === "logo") {
        image = attribute?.value;
      }
      header = attributeTypeName === "header" ? attribute?.value : "";
      subHeader = attributeTypeName === "sub header" ? attribute?.value : "";
    });

    frameDoc.document.write(`

        <center id="top">
           <div class="info">
            <h2>${header.length > 0 ? header : facilityDetails.display} </h2>
            </div>
          <div class="logo">
            <img src="${image}" alt="Facility's Logo">
          </div>

          <div class="info">
            <h2>${
              subHeader.length > 0 ? subHeader : facilityDetails.description
            } </h2>
            <h3>P.O Box ${facilityDetails.postalCode} ${
      facilityDetails.stateProvince
    }</h3>
            <h3>${facilityDetails.country}</h3>
          </div>
          <!--End Info-->
        </center>
        <!--End Document top-->

        <div id="mid">
          <div class="patient-info">
            <p>
                Store Name: ${this.currentLocation?.display}</br>
            </p>
          </div>
        </div>`);

    //For paid items
    if (param.length > 0) {
      frameDoc.document.write(`
          <div>
            <h5>${title}</h5>
          </div>
          <table id="table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Item</th>
                <th>Available Quantity</th>
                <th>Expired Quantity</th>
                <th>Eligible Quantity</th>
                <th>No of Batches</th>
              </tr>
            </thead>
            <tbody>`);

      param.forEach((stock, index) => {
        let currentIndex = index + 1;
        // let paymentDate = new Date(payment.created);
        // Date to string
        // let date_paid = formatDateToString(paymentDate);

        // let date_paid = `${
        //   paymentDate.getDate().toString().length > 1
        //     ? paymentDate.getDate()
        //     : "0" + paymentDate.getDate()
        // }-${
        //   paymentDate.getMonth().toString().length > 1
        //     ? paymentDate.getMonth() + 1
        //     : "0" + paymentDate.getMonth() + 1
        // }-${paymentDate.getFullYear()}`;
        contents = `
                  <tr>
                    <td>${currentIndex}</td>
                    <td>${stock?.name}</td>
                    <td>${stock?.quantity}</td>
                    <td>${stock?.quantity - stock?.eligibleQuantity}</td>
                    <td>${stock?.eligibleQuantity}</td>
                    <td>${stock?.batches?.length}</td>
                  </tr>`;

        frameDoc.document.write(contents);
      });

      frameDoc.document.write(`
            </tbody>
          </table>`);
    }

    frameDoc.document.write(`
            <div class="footer">
              <div class="userDetails">
                <p class="name">Printed By: ${currentUser?.person?.display}</p>
                <p class="signature">Signature : ..............................</p>
              </div>

              <div class=""printDate>
                <p>Printed on: ${printingDate}</p>
              </div>
            </div>
          </div>
        </body>
      </html>`);

    frameDoc.document.close();

    setTimeout(function () {
      window.frames["frame3"].focus();
      window.frames["frame3"].print();
      document.body.removeChild(frame1);
    }, 500);
  }
}
