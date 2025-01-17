import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { getBillingConceptFromLocation } from "src/app/core/helpers/location-billing-concept.helper";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { SharedConfirmationComponent } from "src/app/shared/components/shared-confirmation/shared-confirmation.component";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { VisitsService } from "src/app/shared/resources/visits/services";
import {
  assignDeadBodyToCabinet,
  loadLocationsByTagName,
  loadOrderTypes,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getAllCabinetsDetailsUnderCurrentLocation,
  getAllCabinetsUnderCurrentLocation,
  getOrderTypesByName,
} from "src/app/store/selectors";
import { CabinetOccupancySummaryModalComponent } from "../cabinet-occupancy-summary-modal/cabinet-occupancy-summary-modal.component";

@Component({
  selector: "app-assign-cabinet-modal",
  templateUrl: "./assign-cabinet-modal.component.html",
  styleUrls: ["./assign-cabinet-modal.component.scss"],
})
export class AssignCabinetModalComponent implements OnInit {
  saving: boolean = false;
  cabinetsUnderCurrentLocation$: Observable<any>;
  orderType$: Observable<any>;
  errors: any[] = [];
  deathRegistryEncounterTypeUuid$: Observable<any>;
  assigning: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService,
    private dialog: MatDialog,
    private visitsService: VisitsService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadOrderTypes());
    this.store.dispatch(
      loadLocationsByTagName({ tagName: "Cabinet+Location" })
    );
    this.cabinetsUnderCurrentLocation$ = this.store.select(
      getAllCabinetsDetailsUnderCurrentLocation(
        this.data?.currentLocation?.uuid
      )
    );
    this.orderType$ = this.store.select(getOrderTypesByName, {
      name: "Cabinet Order",
    });

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
  }

  onGetCabinetStatus(cabinetStatus: any, orderType: any): void {
    const billingConcept = getBillingConceptFromLocation(cabinetStatus);
    if (cabinetStatus?.visit?.uuid) {
      this.dialog.open(CabinetOccupancySummaryModalComponent, {
        minWidth: "30%",
        data: cabinetStatus,
      });
    } else {
      this.dialog
        .open(SharedConfirmationComponent, {
          minWidth: "20%",
          data: {
            modalTitle: "Cabinet assignment confirmation",
            modalMessage: `Are you sure to assign ${this.data?.patient?.patient?.display} to ${cabinetStatus?.display} ?`,
            showRemarksInput: false,
            confirmationButtonText: "Yes",
            type: "primary",
            remarksFieldLabel: "Reason",
          },
        })
        .afterClosed()
        .subscribe((confirmed: any) => {
          if (confirmed) {
            this.assigning = true;
            const encounter = {
              patient: this.data?.patient?.patient?.uuid,
              encounterType:
                this.data?.visit?.deathEncounter?.encounterType?.uuid,
              location: cabinetStatus?.uuid,
              encounterProviders: [
                {
                  provider: this.data?.provider?.uuid,
                  encounterRole: ICARE_CONFIG.encounterRole?.uuid,
                },
              ],
              visit: this.data?.visit?.uuid,
              orders: billingConcept
                ? [
                    {
                      concept: billingConcept,
                      orderType: orderType?.id,
                      action: "NEW",
                      careSetting: this.data?.visit?.isAdmitted
                        ? "INPATIENT"
                        : "OUTPATIENT",
                      orderer: this.data?.provider?.uuid,
                      urgency: "ROUTINE",
                      type: "order",
                      patient: this.data?.patient?.uuid,
                    },
                  ]
                : [],
            };
            this.store.dispatch(
              assignDeadBodyToCabinet({ deathDetails: encounter, path: null })
            );

            this.visitsService
              .getActiveVisit(this.data?.patient?.patient?.uuid, false)
              .subscribe((response: any) => {
                if (response) {
                  this.assigning = false;
                }
              });
          }
        });
    }
  }
}
