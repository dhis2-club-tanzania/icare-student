import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import {
  loadLocationsByTagName,
  setCurrentUserCurrentLocation,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getLocationsByTagName,
} from "src/app/store/selectors";

@Component({
  selector: "app-requisition-page",
  templateUrl: "./requisition-page.component.html",
  styleUrls: ["./requisition-page.component.scss"],
})
export class RequisitionPageComponent implements OnInit {
  currentStore$: Observable<any>;
  storeLocations$: Observable<any>;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(loadLocationsByTagName({ tagName: "Store" }));
    this.storeLocations$ = this.store.select(getLocationsByTagName("Store"));
    this.currentStore$ = this.store.pipe(select(getCurrentLocation(false)));
  }

  onSetCurrentStore(event: Event, location: any): void {
    event.stopPropagation();
    this.currentStore$ = of();
    setTimeout(() => {
      this.store.dispatch(setCurrentUserCurrentLocation({ location }));
      this.currentStore$ = this.store.pipe(select(getCurrentLocation(false)));
    }, 50);
  }
}
