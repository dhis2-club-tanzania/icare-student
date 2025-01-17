import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { take, takeLast } from "rxjs/operators";
import { Location } from "src/app/core/models";
import { LocationService } from "src/app/core/services";
import { OccupiedLocationStatusModalComponent } from "src/app/shared/components/occupied-location-status-modal/occupied-location-status-modal.component";
import {
  go,
  loadLocationById,
  loadLocationByIds,
  loadLocationsByTagName,
  loadOrderTypes,
  loadRolesDetails,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getAllBedsUnderCurrentWard,
  getAllLocationsUnderWardAsFlatArray,
  getBedsGroupedByTheCurrentLocationChildren,
  getCurrentLocation,
  getOrderTypesByName,
  getSettingCurrentLocationStatus,
} from "src/app/store/selectors";
import {
  getAllAdmittedPatientVisits,
  getVisitLoadingState,
} from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-inpatient-home",
  templateUrl: "./inpatient-home.component.html",
  styleUrls: ["./inpatient-home.component.scss"],
})
export class InpatientHomeComponent implements OnInit {
  @Input() location: Location;
  currentLocation: Location;
  loadingVisit$: Observable<boolean>;
  bedsUnderCurrentWard$: Observable<any>;
  currentLocation$: Observable<Location>;
  locationsIds$: Observable<string[]>;
  orderType$: Observable<any>;
  settingCurrentLocationStatus$: Observable<boolean>;
  currentLocationUuid: string;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private locationService: LocationService
  ) {
    this.store.dispatch(loadRolesDetails());
  }

  ngOnInit(): void {
    this.currentLocationUuid = this.route.snapshot.params["location"];
    this.settingCurrentLocationStatus$ = this.store.select(
      getSettingCurrentLocationStatus
    );

    /**
     * TODO: Check how to softcode the 'Bed Location' tag
     */

    // this.store
    //   .select(getCurrentLocation)
    //   .subscribe((response) => {
    //     this.currentLocation = response;
    //     // localStorage.setItem(
    //     //   "currentLocation",
    //     //   JSON.stringify(this.currentLocation)
    //     // );
    //     if (this.currentLocation?.childLocations?.length > 0) {
    //       const locationUuids = (
    //         this.location?.childLocations?.filter((loc: any) => !loc.retired) ||
    //         []
    //       ).map((location) => {
    //         return location?.uuid;
    //       });
    //       this.store.dispatch(loadLocationByIds({ locationUuids }));
    //     }
    //   });

    // console.log("this.currentLocation?.uuid", this.currentLocation);
    this.currentLocation = this.location;
    this.bedsUnderCurrentWard$ = this.store.select(getAllBedsUnderCurrentWard, {
      id: this.currentLocation?.uuid,
      tagName: "Bed Location",
    });
    this.locationsIds$ = this.store.select(
      getAllLocationsUnderWardAsFlatArray,
      {
        id: this.currentLocationUuid
          ? this.currentLocationUuid
          : this.currentLocation?.uuid,
        tagName: "Bed Location",
      }
    );
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
    this.store.dispatch(loadOrderTypes());
    this.orderType$ = this.store.select(getOrderTypesByName, {
      name: "Bed Order",
    });
  }

  onSelectPatient(patientData) {
    this.store.dispatch(
      go({
        path: ["/inpatient/dashboard/" + patientData?.patient?.uuid],
        query: { queryParams: { patient: patientData?.patient?.uuid } },
      })
    );
  }

  onBack(e: Event) {
    e.stopPropagation();
    this.store.dispatch(go({ path: ["/"] }));
  }

  onGetBedStatus(status, orderType) {
    this.dialog.open(OccupiedLocationStatusModalComponent, {
      minWidth: "20%",
      minHeight: "200px",
      data: {
        details: status,
      },
      disableClose: true,
      panelClass: "custom-dialog-container",
    });
  }
}
