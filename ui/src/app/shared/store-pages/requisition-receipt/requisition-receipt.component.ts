import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { RequisitionObject } from "src/app/shared/resources/store/models/requisition.model";
import { loadRequisitions } from "src/app/store/actions/requisition.actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation, getLocations } from "src/app/store/selectors";
import { getAllStockableItems } from "src/app/store/selectors/pricing-item.selectors";
import {
  getAllRequisitions,
  getRequisitionLoadingState,
  getRequisitionsReceived,
} from "src/app/store/selectors/requisition.selectors";

@Component({
  selector: "app-requisition-receipt",
  templateUrl: "./requisition-receipt.component.html",
  styleUrls: ["./requisition-receipt.component.scss"],
})
export class RequisitionReceiptComponent implements OnInit {
  requisitions$: Observable<RequisitionObject[]>;
  loadingRequisitions$: Observable<boolean>;
  stores$: Observable<any>;
  stockableItems$: Observable<any>;
  currentStore$: Observable<any>;
  searchTerm: any;
  filterLoaded: boolean;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.requisitions$ = this.store.pipe(select(getRequisitionsReceived)).pipe(
      map((requisitions) => {
        this.filterLoaded = true;
        return requisitions;
      })
    );
    this.loadingRequisitions$ = this.store.pipe(
      select(getRequisitionLoadingState)
    );
    this.stores$ = this.store.pipe(select(getLocations));
    this.currentStore$ = this.store.pipe(select(getCurrentLocation(false)));
    this.stockableItems$ = this.store.pipe(select(getAllStockableItems));
  }

  searchStock(event: any): void {
    this.filterLoaded = false;
    this.searchTerm = event ? event?.target?.value : "";
    setTimeout(() => {
      this.requisitions$ = this.store
        .pipe(select(getRequisitionsReceived))
        .pipe(
          map((requisitions) => {
            if (this.searchTerm?.length > 0) {
              let filteredRequisitions = requisitions?.filter((requisition) => {
                if (
                  requisition?.name
                    ?.toLowerCase()
                    .includes(this.searchTerm.toLowerCase())
                ) {
                  return requisition;
                }
              });
              this.filterLoaded = true;
              return filteredRequisitions;
            }
            this.filterLoaded = true;
            return requisitions;
          })
        );
    }, 200);
  }
}
