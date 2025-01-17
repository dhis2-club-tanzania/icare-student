import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { clearStockMetrics, go, loadStockMetrics } from "src/app/store/actions";
import { loadIssuings } from "src/app/store/actions/issuing.actions";
import { loadLedgerTypes } from "src/app/store/actions/ledger-type.actions";
import { loadRequisitions } from "src/app/store/actions/requisition.actions";
import {
  clearStockData,
  loadStocks,
} from "src/app/store/actions/stock.actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getMetrics,
  getSettingCurrentLocationStatus,
  getIfCurrentLocationIsPharmacy,
} from "src/app/store/selectors";
import {
  getCurrentUserDetails,
  getCurrentUserPrivileges,
} from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-store-home",
  templateUrl: "./store-home.component.html",
  styleUrls: ["./store-home.component.scss"],
})
export class StoreHomeComponent implements OnInit {
  storePages: any[];
  currentStore$: Observable<any>;
  stockMetrics$: Observable<any>;
  settingCurrentLocationStatus$: Observable<boolean>;
  isCurrentLocationPharmacy$: Observable<boolean>;
  currentStorePage: any;
  privileges$: Observable<any>;
  showStoreMetrics: boolean = false;
  currentUser$: Observable<any>;
  constructor(private store: Store<AppState>) {
    this.store.dispatch(clearStockMetrics());
  }

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.settingCurrentLocationStatus$ = this.store.select(
      getSettingCurrentLocationStatus
    );
    this.store.dispatch(loadLedgerTypes());
    this.store.dispatch(loadStockMetrics());
    this.currentStore$ = this.store.pipe(select(getCurrentLocation(false)));
    this.isCurrentLocationPharmacy$ = this.store.pipe(
      select(getIfCurrentLocationIsPharmacy)
    );
    this.storePages = [
      {
        id: "stock",
        name: "Stock",
        url: "stock",
        privilege: "STORE_VIEW_STOCK",
      },
      {
        id: "requisition",
        name: "Requests",
        url: "requisition",
        privilege: "STORE_MAKE_REQUISITION",
      },
      {
        id: "issuing",
        name: "Issuing",
        url: "issuing",
        privilege: "STORE_ISSUE_ITEM",
      },
      {
        id: "settings",
        name: "Settings",
        url: "settings",
        privilege: "STORE_SETTINGS",
      },
    ];
    this.currentStorePage = this.storePages[0];
    this.privileges$ = this.store.select(getCurrentUserPrivileges);
    this.showStoreMetrics = true;
  }

  onChangeRoute(event: any, url?: string, page?: any): void {
    const e = event?.e ? event?.e : event;
    e.stopPropagation();
    this.currentStorePage = page ? page : event?.currentStorePage;
    this.showStoreMetrics = false;
    this.store.dispatch(go({ path: [`/store/${url ? url : event?.url}`] }));
    setTimeout(() => {
      this.showStoreMetrics = true;
    }, 200);
  }
}
