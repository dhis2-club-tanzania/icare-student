import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { admitPatient } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import {
  getAdmissionStatusOfCurrentPatient,
  getAdmittingLoadingState,
} from "src/app/store/selectors/current-patient.selectors";
import { Patient } from "../../resources/patient/models/patient.model";

@Component({
  selector: "app-confirm-modal",
  templateUrl: "./confirm-modal.component.html",
  styleUrls: ["./confirm-modal.component.scss"],
})
export class ConfirmModalComponent implements OnInit {
  header: string;
  message: string;
  dataObject: any;
  admittingState$: Observable<boolean>;
  admissionStatus$: Observable<boolean>;
  currentPatient: Patient;
  orderType: any;
  details: any;
  constructor(
    private dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private store: Store<AppState>
  ) {
    this.header = data?.header;
    this.message = data?.message;
    this.dataObject = data?.dataObject;
    this.currentPatient = data?.currentPatient;
    this.orderType = data?.orderType;
    this.details = data?.details;
  }

  ngOnInit(): void {
    this.admittingState$ = this.store.select(getAdmittingLoadingState);
    this.admissionStatus$ = this.store.select(
      getAdmissionStatusOfCurrentPatient
    );
  }

  onConfirm(event, dataObject, orderType) {
    event.stopPropagation();
    const encounter = {
      patient: dataObject?.patient,
      encounterType: dataObject?.encounterType,
      location: dataObject?.location,
      provider: dataObject?.provider,
      visit: dataObject?.visit,
      orders:
        !this.details?.bedOrdersWithBillStatus ||
        this.details?.bedOrdersWithBillStatus?.length > 0
          ? []
          : [
              {
                concept: dataObject?.billingConcept,
                orderType: orderType?.id,
                action: "NEW",
                careSetting: "INPATIENT",
                orderer: dataObject?.provider,
                urgency: "ROUTINE",
                type: "order",
                patient: dataObject?.patient,
              },
            ],
    };
    this.store.dispatch(
      admitPatient({ admissionDetails: encounter, path: null })
    );
    this.admissionStatus$.subscribe((admissionStatus) => {
      if (!admissionStatus) {
        setTimeout(() => {
          event.stopPropagation();
          this.dialogRef.close(true);
        }, 500);
      }
    });
  }

  onClose(event) {
    event.stopPropagation();
    this.dialogRef.close();
  }
  
}
