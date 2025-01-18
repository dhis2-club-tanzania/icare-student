import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import {
  loadLocationsByTagName,
  setCurrentUserCurrentLocation,
} from "src/app/store/actions";
import { loadRequisitions } from "src/app/store/actions/requisition.actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getLocationsByTagName,
} from "src/app/store/selectors";

@Component({
  selector: "app-issuing-page",
  templateUrl: "./issuing-page.component.html",
  styleUrls: ["./issuing-page.component.scss"],
})
export class IssuingPageComponent implements OnInit {
  currentStore$: Observable<any>;
  storeLocations$: Observable<any[]>;
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
