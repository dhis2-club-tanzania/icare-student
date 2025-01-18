import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { LocationService } from "src/app/core/services";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { LocationGet } from "src/app/shared/resources/openmrs";
import { LedgerInput } from "src/app/shared/resources/store/models/ledger-input.model";
import { StockObject } from "src/app/shared/resources/store/models/stock.model";
import { StockService } from "src/app/shared/resources/store/services/stock.service";
import { SupplierService } from "src/app/shared/resources/store/services/supplier.service";
import { AddNewStockReceivedComponent } from "../../modals/add-new-stock-received/add-new-stock-received.component";

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
  @Input() isStockOutPage: boolean;
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
  constructor(
    private stockService: StockService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
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
    if (!this.isStockOutPage) {
      this.stocksList$ = this.stockService.getAvailableStocks(
        this.currentLocation?.uuid,
        { q: this.searchTerm }
      );
    } else {
      this.stocksList$ = this.stockService.getStockOuts(
        this.currentLocation?.uuid
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

}
