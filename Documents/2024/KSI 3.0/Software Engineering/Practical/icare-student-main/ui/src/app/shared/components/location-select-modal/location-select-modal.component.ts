import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Location } from "src/app/core/models";
import { go, setCurrentUserCurrentLocation } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getLocationLoadingStatus } from "src/app/store/selectors";
import { getUserAssignedLocations } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-location-select-modal",
  templateUrl: "./location-select-modal.component.html",
  styleUrls: ["./location-select-modal.component.scss"],
})
export class LocationSelectModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LocationSelectModalComponent>,
    private store: Store<AppState>
  ) {}
  modules: any[];
  settingLocation = false;
  locationSet = false;
  locations$: Observable<Location[]>;
  loadingLocations$: Observable<boolean>;
  searchingText = "";

  ngOnInit(): void {
    this.locations$ = this.store.select(getUserAssignedLocations);
    this.loadingLocations$ = this.store.pipe(select(getLocationLoadingStatus));
    // Check if user is assigned one location
    this.locations$.subscribe((response) => {
      if (response && response.length === 1) {
        this.setLocation(response[0]);
      }
    });
  }

  setLocation(location: Location): void {
    this.store.dispatch(setCurrentUserCurrentLocation({ location }));
    this.store.dispatch(go({ path: [""] }));
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close(this.modules);
  }

  onSearch(e): void {
    e.stopPropagation();
    this.searchingText = e?.target?.value;
  }

  cancel() {
    this.dialogRef.close();
  }
}
