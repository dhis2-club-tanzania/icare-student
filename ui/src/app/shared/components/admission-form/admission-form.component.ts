import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { LocationService } from "src/app/core/services";
import {
  admitPatient,
  loadCustomOpenMRSForm,
  loadOrderTypes,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getAllOrderTypes,
  getCurrentLocation,
  getLocationsByTagName,
} from "src/app/store/selectors";
import {
  getAdmissionStatusOfCurrentPatient,
  getAdmittingLoadingState,
} from "src/app/store/selectors/current-patient.selectors";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import {
  getCustomOpenMRSFormById,
  getFormsLoadingState,
} from "src/app/store/selectors/form.selectors";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";
import { OpenMRSForm } from "../../modules/form/models/custom-openmrs-form.model";
import { ICARE_CONFIG } from "../../resources/config";
import { OrderCreate } from "../../resources/openmrs";
import { Patient } from "../../resources/patient/models/patient.model";
import { Visit } from "../../resources/visits/models/visit.model";

@Component({
  selector: "app-admission-form",
  templateUrl: "./admission-form.component.html",
  styleUrls: ["./admission-form.component.scss"],
})
export class AdmissionFormComponent implements OnInit {
  patient: Patient;
  formLoadingState$: Observable<boolean>;
  form$: Observable<any>;
  formUuid: any;
  admissionLocations$: Observable<any[]>;
  provider$: Observable<any>;
  minDate: Date;
  maxDate: Date;
  admissionDate: Date;
  admitTo: any;
  sendToObservation: Boolean;
  currentVisit$: Observable<Visit>;
  admittingLoadingState$: Observable<boolean>;
  admissionStatus$: Observable<boolean>;
  currentLocation$: Observable<any>;
  orderTypes$: Observable<any>;
  path: string;
  observationLocations$: Observable<any[]>;
  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<AdmissionFormComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private _snackBar: MatSnackBar,
    private locationService: LocationService
  ) {
    this.store.dispatch(loadOrderTypes());
    this.patient = data?.patient?.patient;
    this.path = data?.path;
    this.sendToObservation = data.sendToObservation;
    this.formUuid = data?.form?.formUuid;
    this.store.dispatch(
      loadCustomOpenMRSForm({ formUuid: data?.form?.formUuid })
    );

    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    const currentYear = new Date().getFullYear();
    // this.minDate = new Date(currentYear, currentMonth, currentDate);
    this.maxDate = new Date(currentYear, currentMonth, currentDate);
  }

  ngOnInit(): void {
    this.orderTypes$ = this.store.select(getAllOrderTypes);
    this.formLoadingState$ = this.store.select(getFormsLoadingState);
    this.form$ = this.store.select(getCustomOpenMRSFormById(this.formUuid));
    this.currentLocation$ = this.store.select(getCurrentLocation(false));
    this.admissionStatus$ = this.store.select(
      getAdmissionStatusOfCurrentPatient
    );
    this.provider$ = this.store.select(getProviderDetails);
    // this.admissionLocations$ = this.store.select(getLocationsByTagName, {
    //   tagName: "Admission Location",
    // });

    this.admissionLocations$ =
      this.locationService.getLocationsByTagName("Admission+Location");
    this.observationLocations$ = this.locationService.getLocationsByTagName(
      "Observation+Location"
    );

    this.currentVisit$ = this.store.select(getActiveVisit);
    this.admittingLoadingState$ = this.store.select(getAdmittingLoadingState);
  }

  onSaveForm(e, provider, visit, currentLocation, orderTypes) {
    e.stopPropagation();
    let data = {
      patient: this.patient["uuid"],
      location: currentLocation?.id,
      visitLocation: this.admitTo?.uuid,
      form: this.formUuid,
      visit: visit?.uuid,
      orders: [],
      provider: provider?.uuid,
      encounterType: ICARE_CONFIG.admission.encounterTypeUuid,
    };
    // Create bill (order) if not insured
    if (!visit?.isEnsured && this.admitTo?.billingConcept) {
      const orderType = (orderTypes.filter(
        (orderType) => orderType?.display.toLowerCase() === "bed order"
      ) || [])[0];
      if (orderType) {
        const order = {
          concept: this.admitTo?.billingConcept,
          orderType: orderType?.uuid,
          patient: this.patient["uuid"],
          careSetting: visit?.isAdmitted ? "OUTPATIENT" : "INPATIENT",
          type: "order",
          orderer: provider?.uuid,
          autoExpireDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
        };
        data.orders.push(order);
      }
    }
    this.store.dispatch(
      admitPatient({ admissionDetails: data, path: this.path })
    );

    this.store
      .select(getAdmissionStatusOfCurrentPatient)
      .subscribe((admissionResponse) => {
        if (admissionResponse) {
          this._snackBar.open("Successfully sent!");
          setTimeout(() => {
            this._snackBar.dismiss();
            this.dialogRef.close();
          }, 600);
        }
      });
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
