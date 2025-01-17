import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AppState } from "src/app/store/reducers";
import {
  getCurrentUserDetails,
  getProviderDetails,
} from "src/app/store/selectors/current-user.selectors";
import { ActivatedRoute } from "@angular/router";
import { CurrentUser } from "src/app/shared/models/current-user.models";
import {
  ProgramenrollmentGetFull,
  WorkflowGetFull,
  WorkflowStateGetFull,
} from "src/app/shared/resources/openmrs";
import { map, tap } from "rxjs/operators";
import { go, loadCurrentPatient } from "src/app/store/actions";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import { ProgramsService } from "src/app/shared/resources/programs/services/programs.service";
import { Location } from "src/app/core/models";
import { getCurrentLocation } from "src/app/store/selectors";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";

@Component({
  selector: "app-patient-dashboard",
  templateUrl: "./patient-dashboard.component.html",
  styleUrls: ["./patient-dashboard.component.scss"],
})
export class PatientDashboardComponent implements OnInit {
  programs$: Observable<any>;
  enrollmentUuid: string;
  patientUuid: string;
  currentUser$: Observable<CurrentUser>;
  patientEnrollmentDetails$: Observable<ProgramenrollmentGetFull>;
  patient$: Observable<any>;
  provider$: Observable<any>;
  selectedState: any;
  renderWorkflowState: boolean = true;
  currentLocation$: Observable<Location>;
  locationFormsAttributeTypeUuid$: Observable<any>;
  errors: any[] = [];
  hideGeneralClinicalFormsBar: boolean = true;
  constructor(
    private store: Store<AppState>,
    private programService: ProgramsService,
    private activatedRoute: ActivatedRoute,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.enrollmentUuid = this.activatedRoute.snapshot.params["id"];
    this.patientUuid = this.activatedRoute.snapshot.params["patient"];

    this.currentUser$ = this.store.select(getCurrentUserDetails);
    this.store.dispatch(loadCurrentPatient({ uuid: this.patientUuid }));
    this.patient$ = this.store.select(getCurrentPatient);
    this.getEnrollmentDetails();
    this.currentLocation$ = this.store.select(getCurrentLocation());
    this.provider$ = this.store.select(getProviderDetails);
    this.locationFormsAttributeTypeUuid$ = this.systemSettingsService
      .getSystemSettingsByKey(
        `iCare.location.general.systemSettings.formsAttributeTypeUuid`
      )
      .pipe(
        tap((response: any) => {
          if (response?.error) {
            this.errors = [
              ...this.errors,
              {
                error: {
                  message:
                    "Key iCare.location.general.systemSettings.formsAttributeTypeUuid is not set, Contact IT",
                },
              },
            ];
          }
          return response;
        })
      );
  }

  getEnrollmentDetails(): void {
    this.patientEnrollmentDetails$ = this.programService
      .getPatientEnrollmentDetails(this.enrollmentUuid)
      .pipe(
        map((enrollment: ProgramenrollmentGetFull) => {
          return {
            ...enrollment,
            program: {
              ...enrollment?.program,
              allWorkflows: enrollment?.program?.allWorkflows?.filter(
                (workFlow: WorkflowGetFull) => !workFlow?.retired
              ),
            },
          };
        })
      );
  }

  onSelectState(event: Event, state: WorkflowStateGetFull): void {
    event.stopPropagation();
    this.renderWorkflowState = false;
    this.selectedState = state;
    setTimeout(() => {
      this.renderWorkflowState = true;
    }, 20);
  }

  onToggleGeneralClinicForms(event: Event): void {
    event.stopPropagation();
    this.hideGeneralClinicalFormsBar = !this.hideGeneralClinicalFormsBar;
  }

  onBackToList(event: Event, url: string): void {
    event.stopPropagation();
    this.store.dispatch(go({ path: [url] }));
  }
}
