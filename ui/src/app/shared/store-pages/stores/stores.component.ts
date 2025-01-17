import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  go,
  loadLocationsByTagName,
  setCurrentUserCurrentLocation,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getLocationsByTagName,
} from "src/app/store/selectors";

@Component({
  selector: "app-stores",
  templateUrl: "./stores.component.html",
  styleUrls: ["./stores.component.scss"],
})
export class StoresComponent implements OnInit {
  storeLocations$: Observable<any>;
  currentStoreLocation: any;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadLocationsByTagName({ tagName: "Store" }));
    this.storeLocations$ = this.store.select(getLocationsByTagName("Store"));
    this.storeLocations$.subscribe((storeLocations: any) => {
      if (storeLocations) {
        this.store.select(getCurrentLocation()).subscribe((response: any) => {
          this.currentStoreLocation = response;
        });
      }
    });
  }

  onSetCurrentStore(event: Event, location: any): void {
    event.stopPropagation();
    this.currentStoreLocation = null;
    setTimeout(() => {
      this.currentStoreLocation = location;
      this.store.dispatch(
        setCurrentUserCurrentLocation({ location: this.currentStoreLocation })
      );
    }, 50);
  }
}
