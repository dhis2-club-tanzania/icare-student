import { Component, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AdmissionFormComponent } from "src/app/shared/components/admission-form/admission-form.component";
import { TransferWithinComponent } from "src/app/shared/components/transfer-within/transfer-within.component";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { startConsultation } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getCurrentLocation } from "src/app/store/selectors";
import {
  getCurrentUserPrivileges,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import { getGroupedObservationByConcept } from "src/app/store/selectors/observation.selectors";
import { getActiveVisit } from "src/app/store/selectors/visit.selectors";
import { ProviderGetFull } from "../../resources/openmrs";
import { Visit } from "../../resources/visits/models/visit.model";
import { CaptureFormDataModalComponent } from "../capture-form-data-modal/capture-form-data-modal.component";

@Component({
  selector: "app-patient-sidebar",
  templateUrl: "./patient-sidebar.component.html",
  styleUrls: ["./patient-sidebar.component.scss"],
})
export class PatientSidebarComponent implements OnInit {
  @Input() currentPatient: Patient;
  @Input() hasPendingPaymentsForCurrentVisitType: boolean;
  @Input() hasConsultationStarted: boolean;
  @Input() isEmergency: boolean;
  @Input() hasDeathStatus: boolean;
  @Input() waitingToBeAdmitted: boolean;
  @Input() isAdmitted: boolean;
  provider$: Observable<ProviderGetFull>;
  visit$: Observable<Visit>;
  currentLocation$: Observable<Location>;
  menus: any[];
  privileges$: Observable<any>;
  observations$: Observable<any>;
  constructor(private dialog: MatDialog, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.privileges$ = this.store.select(getCurrentUserPrivileges);
    this.provider$ = this.store.select(getProviderDetails);
    this.visit$ = this.store.select(getActiveVisit);
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));

    this.observations$ = this.store.select(getGroupedObservationByConcept);
    /**TODO: move to configurations and rename to forms */

    // {
    //   id: 'consult',
    //   name: this.hasConsultationStarted
    //     ? 'Continue Consultation'
    //     : 'Consult Patient',
    //   disabled:
    //     this.hasPendingPaymentsForCurrentVisitType ||
    //     this.hasDeathStatus ||
    //     (this.hasPendingPaymentsForCurrentVisitType && !this.isEmergency)
    //       ? true
    //       : false,
    //   formUuid: null,
    //   forAdmit: null,
    //   redirect: true,
    // },
    this.menus = [
      {
        id: "admit",
        name: "Admit",
        disabled: this.isAdmitted
          ? true
          : this.waitingToBeAdmitted
          ? true
          : this.hasPendingPaymentsForCurrentVisitType ||
            this.hasDeathStatus ||
            (this.hasPendingPaymentsForCurrentVisitType && !this.isEmergency)
          ? true
          : false,
        formUuid: "d2c7532c-fb01-11e2-8ff2-fd54ab5fdb2a",
        forAdmit: true,
      },
      {
        id: "transferwithin",
        name: "Transfer within",
        disabled: false,
        formUuid: "a007bbfe-fbe5-11e2-8ff2-fd54ab5fdb2a",
        forTransfer: true,
        locationType: "Treatment Room",
      },
      {
        id: "referral",
        name: "Refer",
        disabled:
          this.hasPendingPaymentsForCurrentVisitType ||
          this.hasDeathStatus ||
          (this.hasPendingPaymentsForCurrentVisitType && !this.isEmergency)
            ? true
            : false,
        formUuid: "iCARE703-FORM-4df6-a364-abc9b1f48193",
        forTransfer: true,
        locationType: "Refer-to Location",
      },
      {
        id: "appointment",
        name: "Appointment",
        disabled: true,
      },
      {
        id: "mark-patient-deceased",
        name: "Mark Patient Deceased",
        disabled:
          this.hasPendingPaymentsForCurrentVisitType ||
          this.hasDeathStatus ||
          (this.hasPendingPaymentsForCurrentVisitType && !this.isEmergency)
            ? true
            : false,
        formUuid: "73d36615-9a4a-46a4-8134-2dca15acacc1",
        other: true,
      },
    ];
  }

  onOpenForm(
    e,
    config,
    provider,
    privileges,
    currentLocation,
    visit,
    observations
  ) {
    e.stopPropagation();
    !config?.disabled && config?.forAdmit
      ? this.dialog.open(AdmissionFormComponent, {
          height: "230px",
          width: "45%",
          data: {
            patient: this.currentPatient,
            form: config,
            visit,
            path: "/clinic/patient-list",
          },
          disableClose: false,
          panelClass: "custom-dialog-container",
        })
      : !config?.disabled && config?.forTransfer
      ? this.dialog.open(TransferWithinComponent, {
          minHeight: "250px",
          maxHeight: "80vh",
          width: "40%",
          data: {
            patient: this.currentPatient,
            form: config,
            visit,
            path: "/clinic/patient-list",
          },
          disableClose: false,
          panelClass: "custom-dialog-container",
        })
      : !config?.disabled && config?.other
      ? this.dialog.open(CaptureFormDataModalComponent, {
          width: "60%",
          data: {
            patient: this.currentPatient,
            form: config,
            privileges,
            provider,
            visit,
            currentLocation,
          },
          disableClose: false,
        })
      : config.redirect
      ? this.store.dispatch(startConsultation())
      : "";
  }
}
