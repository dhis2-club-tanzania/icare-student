import { Component, Input, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { Location } from "src/app/core/models";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import { CurrentUser } from "src/app/shared/models/current-user.models";
import { DateField } from "src/app/shared/modules/form/models/date-field.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import { WorkflowStateGetFull } from "src/app/shared/resources/openmrs";
import { ProgramsService } from "src/app/shared/resources/programs/services/programs.service";

@Component({
  selector: "app-workflow-state",
  templateUrl: "./workflow-state.component.html",
  styleUrls: ["./workflow-state.component.scss"],
})
export class WorkflowStateComponent implements OnInit {
  @Input() workflowState: WorkflowStateGetFull;
  @Input() patientEnrollmentDetails: any;
  @Input() currentLocation: Location;
  @Input() currentUser: CurrentUser;
  @Input() patient: any;
  @Input() provider: any;
  startDateField: any;
  forms$: Observable<any>;
  patientWorkflowState: any;
  saving: boolean = false;
  startDate: Date = new Date();
  updatedPatientEnrollmentDetails$: Observable<any>;
  constructor(
    private systemSettingsService: SystemSettingsService,
    private programsService: ProgramsService
  ) {}

  ngOnInit(): void {
    this.getPatientEnrollmentDetails();
    this.startDateField = new DateField({
      id: "startDate",
      key: "startDate",
      label: "Start date",
      value: formatDateToYYMMDD(this.startDate),
      required: true,
    });
    this.patientWorkflowState = (this.patientEnrollmentDetails?.states?.filter(
      (stateData: any) =>
        stateData?.state?.concept?.uuid === this.workflowState?.concept?.uuid
    ) || [])[0];
    this.forms$ = this.systemSettingsService.getSystemSettingsByKey(
      `iCare.programs.settings.workflowStateForms.${this.workflowState?.uuid}`
    );
  }

  onFormUpdate(formValue: FormValue): void {
    if (formValue.getValues()?.startDate?.value) {
      this.startDate = new Date(formValue.getValues()?.startDate?.value);
    }
  }

  getPatientEnrollmentDetails(): void {
    this.updatedPatientEnrollmentDetails$ =
      this.programsService.getPatientEnrollmentDetails(
        this.patientEnrollmentDetails?.uuid
      );
  }

  onSettingPatientWorkflowState(event: Event): void {
    event.stopPropagation();
    this.saving = true;
    const data: any = {
      states: [
        {
          state: this.workflowState?.uuid,
          startDate: this.startDate,
        },
      ],
    };

    this.programsService
      .createPatientWorkflowState(data, this.patientEnrollmentDetails?.uuid)
      .subscribe((response: any) => {
        if (response) {
          this.patientWorkflowState = response;
          this.getPatientEnrollmentDetails();
          this.saving = false;
        }
      });
  }
}
