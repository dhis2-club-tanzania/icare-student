import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { getBillingConceptFromLocation } from "src/app/core/helpers/location-billing-concept.helper";
import { Location } from "src/app/core/models";
import { ConfirmModalComponent } from "src/app/shared/components/confirm-modal/confirm-modal.component";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import { admitPatient, loadLocationById } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getAllLocationsUnderWardAsFlatArray,
  getLocationById,
  getOrderTypesByName,
} from "src/app/store/selectors";
import {
  getAdmissionStatusOfCurrentPatient,
  getAdmittingLoadingState,
} from "src/app/store/selectors/current-patient.selectors";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";

@Component({
  selector: "app-assign-bed-to-patient",
  templateUrl: "./assign-bed-to-patient.component.html",
  styleUrls: ["./assign-bed-to-patient.component.scss"],
})
export class AssignBedToPatientComponent implements OnInit {
  currentLocationId: string;
  currentPatient: Patient;
  currentBedStatus: any;
  provider: any;
  visit: Visit;
  bedOrdersWithBillStatus: any;
  /**
   * TODO: softcode admission form
   */
  formUuid: string = "d2c7532c-fb01-11e2-8ff2-fd54ab5fdb2a";
  admittingState$: Observable<boolean>;
  admissionStatus$: Observable<boolean>;
  orderType$: Observable<any>;
  loadingVisit$: Observable<boolean>;
  currentLocation$: Observable<any>;
  locationsIds$: Observable<string[]>;
  constructor(
    private dialogRef: MatDialogRef<AssignBedToPatientComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    this.currentLocationId = data?.location?.uuid;
    this.currentPatient = data?.patient;
    this.provider = data?.provider;
    this.visit = data?.visit;
    this.bedOrdersWithBillStatus = data?.bedOrdersWithBillStatus;
    this.store.dispatch(
      loadLocationById({ locationUuid: this.currentLocationId })
    );
  }

  ngOnInit(): void {
    this.currentLocation$ = this.store.select(getLocationById, {
      id: this.currentLocationId,
    });
    this.admittingState$ = this.store.select(getAdmittingLoadingState);
    this.admissionStatus$ = this.store.select(
      getAdmissionStatusOfCurrentPatient
    );
    this.loadingVisit$ = this.store.select(getVisitLoadingState);

    this.orderType$ = this.store.select(getOrderTypesByName, {
      name: "Bed Order",
    });
    this.locationsIds$ = this.store.select(
      getAllLocationsUnderWardAsFlatArray,
      {
        id: this.currentLocationId,
        tagName: "Bed Location",
      }
    );
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }

  onGetBedStatus(bedStatus, orderType) {
    this.currentBedStatus = bedStatus;
    const data = {
      patient: this.currentPatient?.id,
      location: this.currentBedStatus?.uuid,
      billingConcept: getBillingConceptFromLocation(this.currentBedStatus),
      form: this.formUuid,
      visit: this.visit?.uuid,
      encounterType: ICARE_CONFIG.admission.encounterTypeUuid,
      provider: this.provider?.uuid,
    };
    this.dialog
      .open(ConfirmModalComponent, {
        data: {
          header: "Bed Confirmation",
          message: `Are you sure to assign this bed to ${this.currentPatient?.name}?`,
          is: true,
          dataObject: data,
          currentPatient: this.currentPatient,
          locationDetails: this.currentBedStatus,
          orderType,
          details: this.currentBedStatus,
        },
        minWidth: "28%",
        maxHeight: "210px",
        disableClose: false,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.dialogRef.close();
        }
      });
    this.currentBedStatus = bedStatus;
  }

  onCloseConfirmingDialog(e) {
    e.stopPropagation();
    this.currentBedStatus = null;
  }

  onAdmit(e: Event): void {
    e.stopPropagation();
    const data = {
      encounterDatetime: new Date(),
      patient: this.currentPatient?.id,
      location: this.currentBedStatus?.uuid,
      form: this.formUuid,
      visit: this.visit?.uuid,
      provider: this.provider?.uuid,
    };
    console.log("data", data);
    this.store.dispatch(admitPatient({ admissionDetails: data, path: null }));
  }
}
