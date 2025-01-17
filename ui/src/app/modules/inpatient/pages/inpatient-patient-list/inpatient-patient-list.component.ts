import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  loadLocationById,
  loadLocationsByTagName,
  loadLocationsByTagNames,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentLocation,
  getSettingCurrentLocationStatus,
} from "src/app/store/selectors";

@Component({
  selector: "app-inpatient-patient-list",
  templateUrl: "./inpatient-patient-list.component.html",
  styleUrls: ["./inpatient-patient-list.component.scss"],
})
export class InpatientPatientListComponent implements OnInit {
  currentLocation$: Observable<Location>;
  settingCurrentLocationStatus$: Observable<boolean>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(
      loadLocationById({
        locationUuid: JSON.parse(localStorage.getItem("currentLocation"))?.uuid,
        isCurrentLocation: true,
      })
    );

    // this.store.dispatch(loadLocationsByTagName({ tagName: "Bed+Location" }));
    // this.store.dispatch(
    //   loadLocationsByTagName({ tagName: "Admission+Location" })
    // );
    this.store.dispatch(
      loadLocationsByTagNames({
        tagNames: ["Admission+Location", "Bed+Location"],
      })
    );
    this.currentLocation$ = this.store.select(getCurrentLocation(false));
    this.settingCurrentLocationStatus$ = this.store.select(
      getSettingCurrentLocationStatus
    );
  }
}
