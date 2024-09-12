import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { map } from "lodash";
import { Observable, of } from "rxjs";
import { AdmissionFormComponent } from "src/app/shared/components/admission-form/admission-form.component";
import { PatientVisitHistoryModalComponent } from "src/app/shared/components/patient-visit-history-modal/patient-visit-history-modal.component";
import { getApplicableForms } from "src/app/shared/helpers/identify-applicable-forms.helper";
import { OpenMRSForm } from "src/app/shared/modules/form/models/custom-openmrs-form.model";
import { FormConfig } from "src/app/shared/modules/form/models/form-config.model";
import { ConceptsService } from "src/app/shared/resources/concepts/services/concepts.service";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { ObservationService } from "src/app/shared/resources/observation/services";
import { ProviderGetFull } from "src/app/shared/resources/openmrs";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { Visit } from "src/app/shared/resources/visits/models/visit.model";
import {
  go,
  loadCustomOpenMRSForms,
  loadOrderTypes,
} from "src/app/store/actions";
import {
  clearBills,
  loadPatientBills,
} from "src/app/store/actions/bill.actions";
import { saveObservationsUsingEncounter } from "src/app/store/actions/observation.actions";
import { AppState } from "src/app/store/reducers";
import { getAllOrderTypes, getCurrentLocation } from "src/app/store/selectors";
import {
  getActiveVisitPendingVisitServiceBillStatus,
  getAllBills,
  getLoadingBillStatus,
} from "src/app/store/selectors/bill.selectors";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import {
  getCurrentUserPrivileges,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import {
  getCustomOpenMRSFormsByIds,
  getFormEntitiesByNames,
} from "src/app/store/selectors/form.selectors";
import {
  getGroupedObservationByConcept,
  getSavingObservationStatus,
} from "src/app/store/selectors/observation.selectors";
import {
  getActiveVisit,
  getActiveVisitDeathStatus,
} from "src/app/store/selectors/visit.selectors";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-nursing-data",
  templateUrl: "./nursing-data.component.html",
  styleUrls: ["./nursing-data.component.scss"],
})
export class NursingDataComponent implements OnInit {
  @Input() formPrivilegesConfigs: any;
  @Input() currentUser: any;
  @Input() userPrivileges: any;
  @Input() nursingConfigurations: any;
  @Input() patient: any;
  @Input() currentLocation: any;
  provider$: Observable<ProviderGetFull>;
  visit$: Observable<Visit>;
  currentLocation$: Observable<Location>;
  patient$: Observable<Patient>;
  triageForm$: Observable<OpenMRSForm>;
  observations$: Observable<any>;
  savingObservations$: Observable<boolean>;

  forms$: Observable<any[]>;

  privileges$: Observable<any>;
  applicableForms: any[];
  selectedTab = new FormControl(0);
  doesPatientHasPendingPaymentForTheCurrentVisitType$: Observable<boolean>;
  activeVisitDeathStatus$: Observable<boolean>;
  billLoadingState$: Observable<boolean>;
  currentBills$: Observable<any[]>;
  activeVisitLoadedState$: Observable<boolean>;
  conceptsWithDepartmentsDetails$: Observable<any>;
  orderTypes$: Observable<any[]>;
  locationFormsIds: string[] = [];
  saveAndExitPath: string = "/nursing";
  exitAfterSave: boolean = false;
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private conceptsService: ConceptsService,
    private observationService: ObservationService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.locationFormsIds = this.currentLocation?.forms
      ? this.currentLocation?.forms
      : [];
    this.store.dispatch(
      loadCustomOpenMRSForms({
        formUuids: this.locationFormsIds,
      })
    );
    this.store.dispatch(loadOrderTypes());
    this.orderTypes$ = this.store.select(getAllOrderTypes);
    this.privileges$ = this.store.select(getCurrentUserPrivileges);
    this.conceptsWithDepartmentsDetails$ =
      this.conceptsService.getDepartmentDetails(
        this.nursingConfigurations?.departmentsReference?.id
      );
    this.forms$ = this.store.select(
      getCustomOpenMRSFormsByIds(this.locationFormsIds)
    );
    this.provider$ = this.store.select(getProviderDetails);
    this.visit$ = this.store.select(getActiveVisit);
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation(false)));
    this.patient$ = this.store.pipe(select(getCurrentPatient));

    this.observations$ = this.store.select(getGroupedObservationByConcept);
    this.activeVisitDeathStatus$ = this.store.select(getActiveVisitDeathStatus);
    this.billLoadingState$ = this.store.pipe(select(getLoadingBillStatus));
    this.currentBills$ = this.store.select(getAllBills);
    this.doesPatientHasPendingPaymentForTheCurrentVisitType$ = this.store.pipe(
      select(getActiveVisitPendingVisitServiceBillStatus)
    );
  }

  onExitAfterSave(exitAfterSave: boolean): void {
    this.exitAfterSave = exitAfterSave;
  }

  onSaveObservations(data: any, patient): void {
    this.savingObservations$ = of(true);
    this.observationService
      .saveEncounterWithObsDetails(data)
      .subscribe((res) => {
        if (res) {
          this.ngOnInit();
          this.savingObservations$ = of(false);
          this._snackBar.open(`Successfully saved data`, "OK", {
            horizontalPosition: "center",
            verticalPosition: "bottom",
            duration: 6000,
            panelClass: ["snack-color-ok"],
          });
          setTimeout(() => {
            this.store.dispatch(go({ path: [this.saveAndExitPath] }));
          }, 300);
        }
      });
    // this.store.dispatch(
    //   saveObservationsUsingEncounter({
    //     data,
    //     patientId: patient?.patient?.uuid,
    //   })
    // );
  }

  changeTab(index) {
    this.selectedTab.setValue(index);
  }

  clearBills(event: Event) {
    event.stopPropagation();
    this.store.dispatch(clearBills());
  }

  admitPatient(
    event: Event,
    currentPatient,
    visit,
    sendToObservation: Boolean
  ): void {
    event.stopPropagation();

    this.dialog.open(AdmissionFormComponent, {
      minHeight: "230px",
      width: "45%",
      data: {
        patient: currentPatient,
        form: {
          formUuid: "d2c7532c-fb01-11e2-8ff2-fd54ab5fdb2a",
        },
        visit,
        path: "/nursing",
        sendToObservation,
      },
      disableClose: false,
      panelClass: "custom-dialog-container",
    });
  }

  viewPatientHistory(
    event: Event,
    patientUuid: any,
    params: { location: any }
  ) {
    event.stopPropagation();
    this.dialog.open(PatientVisitHistoryModalComponent, {
      minWidth: "40%",
      minHeight: "auto",
      data: { patientUuid, vitals: true, location: params?.location },
    });
  }
}
