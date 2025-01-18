import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Location } from "src/app/core/models";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import {
  go,
  loadCustomOpenMRSForm,
  transferPatient,
} from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getLocations, getLocationsByTagName } from "src/app/store/selectors";
import {
  getTransferLoadingState,
  getTransferStatusOfCurrentPatient,
} from "src/app/store/selectors/current-patient.selectors";
import { getProviderDetails } from "src/app/store/selectors/current-user.selectors";
import {
  getCustomOpenMRSFormById,
  getFormsLoadingState,
} from "src/app/store/selectors/form.selectors";
import {
  getActiveVisit,
  getCurrentVisitServiceAttributeDetails,
  getCurrentVisitServiceBillingAttributeDetails,
} from "src/app/store/selectors/visit.selectors";
import { OpenMRSForm } from "../../modules/form/models/custom-openmrs-form.model";
import { FormValue } from "../../modules/form/models/form-value.model";
import { Patient } from "../../resources/patient/models/patient.model";
import { Visit } from "../../resources/visits/models/visit.model";

@Component({
  selector: "app-transfer-within",
  templateUrl: "./transfer-within.component.html",
  styleUrls: ["./transfer-within.component.scss"],
})
export class TransferWithinComponent implements OnInit {
  patient: Patient;
  formLoadingState$: Observable<boolean>;
  form$: Observable<OpenMRSForm>;
  formUuid: any;
  locations$: Observable<any[]>;
  provider$: Observable<any>;
  transferTo: any;
  currentVisit$: Observable<Visit>;
  transferLoadingState$: Observable<boolean>;
  transferStatus$: Observable<boolean>;
  locationType: string;
  path: string;
  isFormValid: boolean = false;
  obs: any[] = [];
  visit: any;
  currentLocation: Location;

  // TODO: Transfer logic for creating bill if insurance does not support more than one consultation to use configurations fromglobal properties
  shouldNotCreateBill: boolean = false;
  currentVisitServiceAttributeDetails$: Observable<any>;
  currentVisitServiceBillingAttributeDetails$: Observable<any>;

  locationServiceAttribute$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<TransferWithinComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private systemSettingsService: SystemSettingsService
  ) {
    this.patient = data?.patient?.patient;
    this.locationType = data?.locationType;
    this.currentLocation = data?.currentLocation;
    this.path = data?.path;
    this.visit = data?.visit;

    this.formUuid = data?.form?.formUuid;
    if (this.formUuid) {
      this.store.dispatch(
        loadCustomOpenMRSForm({ formUuid: data?.form?.formUuid })
      );
    }
  }

  ngOnInit(): void {
    this.locationServiceAttribute$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "iCare.clinic.location.serviceAttribute"
      );
    this.formLoadingState$ = this.store.select(getFormsLoadingState);
    this.form$ = this.store.select(getCustomOpenMRSFormById, {
      id: this.formUuid,
    });
    this.transferStatus$ = this.store.select(getTransferStatusOfCurrentPatient);
    this.provider$ = this.store.select(getProviderDetails);
    this.locations$ = this.store.select(getLocationsByTagName, {
      tagName: this.locationType,
    });
    this.currentVisit$ = this.store.select(getActiveVisit);
    this.transferLoadingState$ = this.store.select(getTransferLoadingState);
    this.currentVisitServiceAttributeDetails$ = this.store.select(
      getCurrentVisitServiceAttributeDetails
    );
    this.currentVisitServiceBillingAttributeDetails$ = this.store.select(
      getCurrentVisitServiceBillingAttributeDetails
    );
  }

  onSaveForm(e: Event, provider, visit, obs, locationServiceAttribute): void {
    e.stopPropagation();
    const services = (
      this.currentLocation?.attributes?.filter(
        (attribute) =>
          !attribute?.voided &&
          attribute?.attributeType?.uuid === locationServiceAttribute
      ) || []
    )?.map((attr) => attr?.value);
    (
      services?.filter(
        (service) => service === this.transferTo?.billingConcept
      ) || []
    )?.length > 0
      ? true
      : (
          visit.attributes.filter(
            (attribute) =>
              attribute?.visitAttributeDetails?.attributeType?.display.toLowerCase() ===
                "paymentcategory" &&
              attribute?.visitAttributeDetails?.value ===
                "00000101IIIIIIIIIIIIIIIIIIIIIIIIIIII"
          ) || []
        )?.length > 0 &&
        (
          visit.attributes.filter(
            (attribute) =>
              attribute?.visitAttributeDetails?.attributeType?.display.toLowerCase() ===
                "paymentscheme" &&
              (attribute?.visitAttributeDetails?.value ===
                "274f186c-a9c0-4f37-a3c8-5b18f61353b3" ||
                attribute?.visitAttributeDetails?.value ===
                  "f8c42c7f-f570-4278-bf72-e5e97c9ed321" ||
                attribute?.visitAttributeDetails?.value ===
                  "29238e76-5cbe-476a-914d-7fdb9842b3d6")
          ) || []
        )?.length > 0;
    const data = {
      patient: this.patient["uuid"],
      visitLocation: this.transferTo?.uuid,
      location: this.currentLocation?.uuid,
      form: this.formUuid,
      obs: obs,
      orders: this.shouldNotCreateBill
        ? []
        : [
            {
              concept: this.transferTo?.billingConcept,
              type: "order",
              action: "NEW",
              careSetting: !this.visit?.isAdmitted ? "OUTPATIENT" : "INPATIENT",
              orderer: provider?.uuid,
              urgency: "ROUTINE",
              orderType: "BIL00000IIIIIIIIIIIIIIIIIIIIIIIOTYPE",
            },
          ],
      visit: visit?.uuid,
      provider: provider?.uuid,
    };
    // const visitAttributes =
    //   this.shouldNotCreateBill || this.visit?.isAdmitted
    //     ? []
    //     : [
    //         {
    //           uuid: currentVisitServiceAttributeDetails?.visitAttributeDetails
    //             ?.uuid,
    //           attributeType:
    //             currentVisitServiceAttributeDetails?.visitAttributeDetails
    //               ?.attributeType?.uuid,
    //           value: this.transferTo?.billingConcept,
    //         },
    //       ];
    this.store.dispatch(
      transferPatient({
        transferDetails: data,
        path: this.path,
        visitAttributes: [],
      })
    );

    this.transferLoadingState$.subscribe((response) => {
      if (response) {
        this.store.dispatch(go({ path: ["/clinic/patient-list"] }));
      }
    });
  }

  onFormUpdate(formValues: FormValue): void {
    this.isFormValid = formValues?.isValid;
    const values = formValues.getValues();
    this.obs = Object.keys(values).map((key) => {
      return {
        concept: key,
        value: values[key]?.value,
      };
    });
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close();
  }
}
