import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { take, tap } from "rxjs/operators";
import { Location } from "src/app/core/models";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import {
  go,
  loadLocationById,
  loadLocationsByTagName,
  loadOrderTypes,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getAllCabinetsUnderCurrentLocation,
  getAllLocationsMortuaryAsFlatArray,
  getAllLocationsUnderWardAsFlatArray,
  getCurrentLocation,
  getOrderTypesByName,
} from "src/app/store/selectors";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";
import { CabinetOccupancySummaryModalComponent } from "../../modals/cabinet-occupancy-summary-modal/cabinet-occupancy-summary-modal.component";

@Component({
  selector: "app-mortuary-home",
  templateUrl: "./mortuary-home.component.html",
  styleUrls: ["./mortuary-home.component.scss"],
})
export class MortuaryHomeComponent implements OnInit {
  currentLocation: Location;
  loadingVisit$: Observable<boolean>;
  cabinetsUnderCurrentLocation$: Observable<Location[]>;
  currentLocation$: Observable<Location>;
  deathRegistryEncounterTypeUuid$: Observable<string>;
  errors: any[] = [];
  cabinets$: Observable<any>;
  locationsIds$: Observable<any>;
  orderType$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.store
      .select(getCurrentLocation(false))
      .pipe(take(1))
      .subscribe((location) => {
        /**
         * TODO: Check how to softcode the 'Mortuary Location' tag
         */
        this.currentLocation = location;
        this.store.dispatch(
          loadLocationsByTagName({ tagName: "Cabinet+Location" })
        );
        this.store.dispatch(loadLocationById({ locationUuid: location?.uuid }));
        this.cabinetsUnderCurrentLocation$ = this.store.select(
          getAllCabinetsUnderCurrentLocation,
          {
            id: location?.uuid,
            tagName: "Cabinet Location",
          }
        );
      });
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
    this.deathRegistryEncounterTypeUuid$ = this.systemSettingsService
      .getSystemSettingsByKey(`iCare.mortuary.settings.encounterTypeUuid`)
      .pipe(
        tap((response: any) => {
          if (response?.error) {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "iCare.mortuary.settings.encounterTypeUuid is not set, contact IT",
                },
              },
            ];
          }
          return response;
        })
      );

    this.cabinets$ = this.store.select(getAllLocationsMortuaryAsFlatArray, {
      id: this.currentLocation?.uuid,
      tagName: "Cabinet Location",
    });
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
    this.store.dispatch(loadOrderTypes());
    this.orderType$ = this.store.select(getOrderTypesByName, {
      name: "Cabinet Order",
    });
  }

  onSelectPatient(event: any): void {
    this.store.dispatch(
      go({
        path: [
          "/mortuary/dashboard/" +
            event?.patient?.uuid +
            "/" +
            event?.visitUuid,
        ],
      })
    );
  }

  onGetCabinetStatus(cabinetStatus: any): void {
    this.dialog.open(CabinetOccupancySummaryModalComponent, {
      minWidth: "30%",
      data: cabinetStatus,
    });
  }
}
