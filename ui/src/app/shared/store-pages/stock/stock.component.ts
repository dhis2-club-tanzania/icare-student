import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable, of, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { LedgerInput } from "src/app/shared/resources/store/models/ledger-input.model";
import { LedgerTypeObject } from "src/app/shared/resources/store/models/ledger-type.model";
import { StockObject } from "src/app/shared/resources/store/models/stock.model";
import {
  saveStockLedger,
  setCurrentStock,
} from "src/app/store/actions/stock.actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getIfCurrentLocationIsMainStore,
  getIfCurrentLocationIsPharmacy,
} from "src/app/store/selectors";
import { getCurrentUserPrivileges } from "src/app/store/selectors/current-user.selectors";
import { getAllLedgerTypes } from "src/app/store/selectors/ledger-type.selectors";
import {
  getAllStocks,
  getCurrentStock,
  getLedgerSavingStatus,
  getStockLoadedState,
  getStockLoadingState,
} from "src/app/store/selectors/stock.selectors";

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.scss"],
})
export class StockComponent implements OnInit {
  currentStock$: Observable<StockObject>;
  ledgerTypes$: Observable<LedgerTypeObject[]>;
  currentStore$: Observable<any>;
  isCurrentLocationMainStore$: Observable<boolean>;
  isCurrentLocationPharmacy$: Observable<boolean>;
  searchTerm: string = "";
  stockLoadedState$: Observable<boolean>;
  userPrivileges$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.stockLoadedState$ = this.store.select(getStockLoadedState);
    this.ledgerTypes$ = this.store.pipe(select(getAllLedgerTypes));
    this.currentStore$ = this.store.pipe(select(getCurrentLocation(false)));
    this.currentStock$ = this.store.pipe(select(getCurrentStock));
    this.isCurrentLocationMainStore$ = this.store.pipe(
      select(getIfCurrentLocationIsMainStore)
    );
    this.isCurrentLocationPharmacy$ = this.store.pipe(
      select(getIfCurrentLocationIsPharmacy)
    );
    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges);
  }

  onToggleCurrentStock(stock: StockObject): void {
    this.store.dispatch(setCurrentStock({ currentStockId: stock.id }));
  }

  onSaveLedger(ledgerInput: LedgerInput, currentStock: any): void {
    this.store.dispatch(saveStockLedger({ ledgerInput }));
    // TODO: Remove timeout thing

    this.currentStock$ = of(null);
    setTimeout(() => {
      this.currentStock$ = this.store.pipe(select(getCurrentStock));
    }, 200);
  }
}
