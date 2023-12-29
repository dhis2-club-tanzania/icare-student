import { Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { FormConfig } from "src/app/shared/modules/form/models/form-config.model";
import { ObsCreate } from "src/app/shared/resources/openmrs";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { VisitObject } from "src/app/shared/resources/visits/models/visit-object.model";
import {
  checkIfConsultationIsStarted,
  finishConsultation,
  go,
  loadCustomOpenMRSForms,
  loadForms,
  loadOrderTypes,
} from "src/app/store/actions";
import { saveObservations } from "src/app/store/actions/observation.actions";
import { AppState } from "src/app/store/reducers";
import {
  getConsultationActiveVisit,
  getCurrentLocation,
} from "src/app/store/selectors";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import {
  getCustomOpenMRSFormsByIds,
  getFormEntitiesByNames,
  getFormsLoadingState,
} from "src/app/store/selectors/form.selectors";
import {
  getGroupedObservationByConcept,
  getSavingObservationStatus,
} from "src/app/store/selectors/observation.selectors";
import { getVisitLoadingState } from "src/app/store/selectors/visit.selectors";
import { ICARE_CONFIG } from "src/app/shared/resources/config";

const CONSULTATION_FORM_CONFIGS: FormConfig[] = [
  {
    name: "All opd observations",
    formLevel: 5,
  },
  { name: "Vitals", formLevel: 4 },
  { name: "Visit Diagnoses", formLevel: 2 },
  { name: "All orderables", formLevel: 5 },
];

import { map, filter } from "lodash";
import { BillableItemsService } from "src/app/shared/resources/billable-items/services/billable-items.service";
import { getApplicableForms } from "../../helpers/identify-applicable-forms.helper";
import { VisitsService } from "../../resources/visits/services";
import { PatientVisitHistoryModalComponent } from "../patient-visit-history-modal/patient-visit-history-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { clearBills } from "src/app/store/actions/bill.actions";
import { AddDiagnosisModalComponent } from "../add-diagnosis-modal/add-diagnosis-modal.component";

@Component({
  selector: "app-shared-patient-consultation",
  templateUrl: "./shared-patient-consultation.component.html",
  styleUrls: ["./shared-patient-consultation.component.scss"],
})
export class SharedPatientConsultationComponent implements OnInit {
  @Input() formPrivilegesConfigs: any;
  @Input() currentUser: any;
  @Input() patientIdentifier: string;
  @Input() userPrivileges: any;
  consultationForms$: Observable<any>;
  loadingForms$: Observable<boolean>;
  loadingVisit$: Observable<boolean>;
  observations$: Observable<any>;
  currentPatient$: Observable<Patient>;
  currentLocation$: Observable<Location>;
  activeVisit$: Observable<VisitObject>;
  savingObservations$: Observable<boolean>;

  triageForm$: Observable<any>;
  forms$: Observable<any[]>;

  privileges$: Observable<any>;
  billableItems$: Observable<any>;

  applicableForms: any[];
  patientVisits$: Observable<any>;
  observationsGroupedByConcept$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private billableItemsService: BillableItemsService,
    private visitService: VisitsService,
    private dialog: MatDialog,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.applicableForms = getApplicableForms(
      ICARE_CONFIG,
      this.currentUser,
      this.formPrivilegesConfigs,
      this.userPrivileges
    );
    this.store.dispatch(
      loadCustomOpenMRSForms({
        formUuids: filter(
          map(this.applicableForms, (form) => {
            return form?.id;
          }),
          (uuid) => uuid
        ),
      })
    );
    this.store.dispatch(
      loadForms({ formConfigs: ICARE_CONFIG?.consultation?.forms })
    );
    this.store.dispatch(checkIfConsultationIsStarted());
    this.observations$ = this.store.pipe(
      select(getGroupedObservationByConcept)
    );
    this.consultationForms$ = this.store.pipe(
      select(getFormEntitiesByNames(CONSULTATION_FORM_CONFIGS))
    );
    this.loadingForms$ = this.store.pipe(select(getFormsLoadingState));
    this.currentPatient$ = this.store.pipe(select(getCurrentPatient));
    this.loadingVisit$ = this.store.pipe(select(getVisitLoadingState));
    this.currentLocation$ = this.store.pipe(select(getCurrentLocation));
    this.activeVisit$ = this.store.pipe(select(getConsultationActiveVisit));

    this.savingObservations$ = this.store.pipe(
      select(getSavingObservationStatus)
    );

    this.observationsGroupedByConcept$ = this.store.select(
      getGroupedObservationByConcept
    );

    this.store.dispatch(loadOrderTypes());
    this.billableItems$ = this.billableItemsService.getItemsWithPrices();
  }

  onOpenForm(formName): void {
    console.log(formName);
  }

  onSaveObservations(observations: ObsCreate[], patient): void {
    this.store.dispatch(
      saveObservations({ observations, patientId: patient?.patient?.uuid })
    );
  }

  onDone(e): void {
    e.stopPropagation();

    // let msg = new SpeechSynthesisUtterance('Hello World');
    // window.speechSynthesis.speak(msg);

    this.store.dispatch(finishConsultation());
    this.store.dispatch(go({ path: ["/clinic"] }));
    // this.speak('Silvanus Ilomo. Engear chumba namba kumi');
  }

  speak(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.8;
    speech.voice = window.speechSynthesis.getVoices()[2];
    window.speechSynthesis.speak(speech);
  }

  onGetBackToPatientDashboard(event, patient) {
    event.stopPropagation();
    this.store.dispatch(
      go({ path: ["/clinic/patient-dashboard/" + patient?.uuid] })
    );
  }

  viewPatientHistory(event: Event, patientUuid) {
    event.stopPropagation();
    this.dialog.open(PatientVisitHistoryModalComponent, {
      width: "85%",
      minHeight: "75vh",
      data: { patientUuid },
    });
  }
//modified clearBills method
   clearBills(event: Event){
    event.stopPropagation();
    this.store.dispatch(clearBills());
    this.store.dispatch(go({ path: ["/clinic/patient-list"] }));
  }
     navigateToList(){
    this.routernavigate(['/clinic/patient-list']);
     }
  //onOpenNewDiagnosisModal method

  onOpenNewDiagnosisModal(event: Event, patient, diagnosisForm, visit): void {
    event.stopPropagation();
    this.dialog.open(AddDiagnosisModalComponent, {
      width: "75%",
      data: {
        patient,
        diagnosisForm,
        visit,
      },
    });
  }
}
