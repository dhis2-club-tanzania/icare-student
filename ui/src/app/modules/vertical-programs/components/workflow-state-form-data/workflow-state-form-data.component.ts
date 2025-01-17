import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Location } from "src/app/core/models";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { ICARE_CONFIG } from "src/app/shared/resources/config";
import { WorkflowStateGetFull } from "src/app/shared/resources/openmrs";
import { ProgramsService } from "src/app/shared/resources/programs/services/programs.service";
import { EncountersService } from "src/app/shared/services/encounters.service";
import { loadCustomOpenMRSForm } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";
import { getCustomOpenMRSFormById } from "src/app/store/selectors/form.selectors";
import { flatten, orderBy, groupBy, keyBy } from "lodash";

@Component({
  selector: "app-workflow-state-form-data",
  templateUrl: "./workflow-state-form-data.component.html",
  styleUrls: ["./workflow-state-form-data.component.scss"],
})
export class WorkflowStateFormDataComponent implements OnInit {
  @Input() form: any;
  @Input() workflowState: WorkflowStateGetFull;
  @Input() patientEnrollmentDetails: any;
  @Input() provider: any;
  @Input() currentLocation: Location;
  @Input() patientWorkflowState: any;
  formDetails$: Observable<any>;
  isFormValid: boolean = false;
  formData: any = {};
  saving: boolean = false;
  patientStateEncounterDetails$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private encountersService: EncountersService,
    private programsService: ProgramsService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      loadCustomOpenMRSForm({
        formUuid: this.form?.uuid,
      })
    );
    this.formDetails$ = this.store.select(
      getCustomOpenMRSFormById(this.form?.uuid)
    );
    if (this.patientWorkflowState) {
      this.getPatientStateEncounterDetails();
    }
  }

  onFormUpdate(formValue: FormValue): void {
    this.formData = formValue.getValues();
    this.isFormValid = formValue.isValid;
  }

  onSave(event: Event, form: any): void {
    event.stopPropagation();
    this.saving = true;
    const encounter: any = {
      encounterDatetime: new Date(),
      patient: this.patientEnrollmentDetails?.patient?.uuid,
      location: this.currentLocation?.uuid,
      form: form?.uuid,
      obs: Object.keys(this.formData)
        .map((key: string) => {
          return {
            concept: key,
            value: this.formData[key]?.value,
            obsDatetime: new Date(),
          };
        })
        ?.filter((observation: any) => observation?.value),
      encounterType: form?.encounterType?.uuid,
      encounterProviders: [
        {
          provider: this.provider?.uuid,
          encounterRole: ICARE_CONFIG.encounterRole.uuid,
        },
      ],
    };
    this.encountersService
      .createEncounter(encounter)
      .subscribe((response: any) => {
        // TODO: Handle error

        if (response) {
          const data = {
            patientState: {
              uuid: this.patientWorkflowState?.uuid,
            },
            encounters: [
              {
                uuid: response?.uuid,
              },
            ],
          };
          this.programsService
            .createEncounterPatientState(data)
            .subscribe((response: any) => {
              if (response) {
                this.getPatientStateEncounterDetails();
                this.saving = false;
              }
            });
        }
      });
  }

  getPatientStateEncounterDetails(): void {
    this.patientStateEncounterDetails$ = this.programsService
      .getPatientStateEncounterDetails(this.patientWorkflowState?.uuid)
      .pipe(
        map((response: any[]) => {
          const obs: any[] = flatten(
            response?.map((encounter: any) => {
              return encounter?.obs?.map((observation: any) => {
                return {
                  ...observation,
                  valueObject: observation?.value?.uuid
                    ? observation?.value
                    : null,
                  encounter: encounter,
                  conceptUuid: observation?.concept?.uuid,
                };
              });
            })
          );
          const groupedObsByConcept: any = groupBy(obs, "conceptUuid");
          const formattedObs = Object.keys(groupedObsByConcept).map((key) => {
            return {
              uuid: key,
              history: orderBy(
                groupedObsByConcept[key],
                ["obsDatetime"],
                ["asc"]
              ),
              latest: orderBy(
                groupedObsByConcept[key],
                ["obsDatetime"],
                ["desc"]
              )[0],
            };
          });

          return keyBy(formattedObs, "uuid");
        })
      );
  }
}
