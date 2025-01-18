import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { LedgerInput } from "src/app/shared/resources/store/models/ledger-input.model";
import { StockObject } from "src/app/shared/resources/store/models/stock.model";
import { StockService } from "src/app/shared/resources/store/services/stock.service";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getIfCurrentLocationIsMainStore,
} from "src/app/store/selectors";
import { getCurrentUserPrivileges } from "src/app/store/selectors/current-user.selectors";
import { getAllLedgerTypes } from "src/app/store/selectors/ledger-type.selectors";
import { getCurrentStock } from "src/app/store/selectors/stock.selectors";

@Component({
  selector: "app-nearly-stocked-out-items",
  templateUrl: "./nearly-stocked-out-items.component.html",
  styleUrls: ["./nearly-stocked-out-items.component.scss"],
})
export class NearlyStockedOutItemsComponent implements OnInit {
  locationId: string;
  expiredItemsList$: Observable<any>;
  saving: boolean = false;
  currentItemStock$: Observable<StockObject>;
  ledgerTypes$: Observable<any>;
  currentStore$: Observable<any>;
  currentStock$: Observable<any>;
  isCurrentLocationMainStore$: Observable<boolean>;
  userPrivileges$: Observable<any>;
  constructor(
    private route: ActivatedRoute,
    private stockService: StockService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.locationId = this.route?.snapshot?.params["location"];
    this.ledgerTypes$ = this.store.pipe(select(getAllLedgerTypes));
    this.currentStore$ = this.store.pipe(select(getCurrentLocation(false)));
    this.currentStock$ = this.store.pipe(select(getCurrentStock));
    this.isCurrentLocationMainStore$ = this.store.pipe(
      select(getIfCurrentLocationIsMainStore)
    );
    this.userPrivileges$ = this.store.select(getCurrentUserPrivileges);
  }

  onGoBack(): void {
    this.store.dispatch(go({ path: ["/store/stock"] }));
  }

  onToggleCurrentStock(event: Event, stock: StockObject): void {
    if (event) {
      event.stopPropagation();
      this.currentItemStock$ = this.stockService.getAvailableStockOfAnItem(
        stock?.id,
        this.locationId
      );
    } else {
      this.currentItemStock$ = of(null);
    }
  }

  onSaveLedger(ledgerInput: LedgerInput, currentStock: any): void {
    this.saving = true;
    this.stockService.saveStockLedger(ledgerInput).subscribe((response) => {
      if (response) {
        this.saving = false;
        this.currentItemStock$ = this.stockService.getAvailableStockOfAnItem(
          currentStock?.id,
          this.locationId
        );
      }
    });
  }
}
