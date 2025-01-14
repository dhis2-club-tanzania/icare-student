import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { CurrentUser } from "src/app/shared/models/current-user.models";
import { Dropdown } from "src/app/shared/modules/form/models/dropdown.model";
import { FormValue } from "src/app/shared/modules/form/models/form-value.model";
import {
  ProgramGetFull,
  WorkflowGetFull,
  WorkflowStateGetFull,
} from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-programs-workflows-and-forms-relationship",
  templateUrl: "./programs-workflows-and-forms-relationship.component.html",
  styleUrls: ["./programs-workflows-and-forms-relationship.component.scss"],
})
export class ProgramsWorkflowsAndFormsRelationshipComponent implements OnInit {
  @Input() currentUser: CurrentUser;
  @Input() programs: ProgramGetFull[];
  programSelectionFormField: any;
  programWorkFlowField: any;
  programWorkFlowStateField: any;
  formData: { [key: string]: any };
  selectedWorkflowState: WorkflowStateGetFull;
  selectedForms: any[] = [];
  saving: boolean = false;
  workflowStateFormsSettings$: Observable<any>;
  constructor(private systemSettingsService: SystemSettingsService) {}

  ngOnInit(): void {
    this.programs = this.programs?.map((program: any) => {
      return {
        ...program,
        allWorkflows:
          program?.allWorkflows?.filter(
            (workflow: WorkflowGetFull) => !workflow?.retired
          ) || [],
      };
    });
    this.programSelectionFormField = new Dropdown({
      id: "program",
      key: "program",
      label: "Program",
      required: true,
      value: this.programs[0]?.uuid,
      options: this.programs?.map((program: any) => {
        return {
          key: program?.uuid,
          value: program?.uuid,
          label: program?.name,
          name: program?.name,
        };
      }),
    });
  }

  onFormUpdate(formValue: FormValue): void {
    this.formData = { ...this.formData, ...formValue.getValues() };
    if (this.formData["program"]?.value) {
      const program: any = (this.programs?.filter(
        (program: any) => program?.uuid === this.formData["program"]?.value
      ) || [])[0];
      this.programWorkFlowField = new Dropdown({
        id: "workflow",
        key: "workflow",
        label: "Workflow",
        value: program?.allWorkflows[0]?.uuid,
        options: program?.allWorkflows?.map((workflow: any) => {
          return {
            key: workflow?.uuid,
            value: workflow?.uuid,
            label: workflow?.concept?.display,
            name: workflow?.concept?.display,
          };
        }),
      });
    }
  }

  onFWorkflowUpdate(formValue: FormValue): void {
    this.formData = { ...this.formData, ...formValue.getValues() };
    if (this.formData["workflow"]?.value) {
      const program: any = (this.programs?.filter(
        (program: any) => program?.uuid == this.formData["program"]?.value
      ) || [])[0];
      const workflow: any = (program?.allWorkflows?.filter(
        (workflow: any) => workflow?.uuid === this.formData["workflow"]?.value
      ) || [])[0];
      this.programWorkFlowStateField = new Dropdown({
        id: "workflowState",
        key: "workflowState",
        label: "workflowState",
        value: workflow?.states[0]?.uuid,
        options: workflow?.states?.map((workflowState: any) => {
          return {
            key: workflowState?.uuid,
            value: workflowState?.uuid,
            label: workflowState?.concept?.display,
            name: workflowState?.concept?.display,
          };
        }),
      });
    }
  }

  onWorkflowStateUpdate(formValue: FormValue): void {
    this.formData = { ...this.formData, ...formValue.getValues() };
    const program: any = (this.programs?.filter(
      (program: any) => program?.uuid == this.formData["program"]?.value
    ) || [])[0];
    const workflow: any = (program?.allWorkflows?.filter(
      (workflow: any) => workflow?.uuid === this.formData["workflow"]?.value
    ) || [])[0];
    this.selectedWorkflowState = (workflow?.states?.filter(
      (state: WorkflowStateGetFull) =>
        state?.uuid === this.formData?.workflowState?.value
    ) || [])[0];
    this.workflowStateFormsSettings$ =
      this.systemSettingsService.getSystemSettingsDetailsByKey(
        `iCare.programs.settings.workflowStateForms.${this.selectedWorkflowState?.uuid}`
      );

    this.workflowStateFormsSettings$.subscribe(
      (workflowStateFormsSystemSettings: any) => {
        if (workflowStateFormsSystemSettings) {
          this.selectedForms = workflowStateFormsSystemSettings?.value;
        }
      }
    );
  }

  onGetSelectedItems(selectedItems: any[]): void {
    // console.log(selectedItems);
    this.selectedForms = selectedItems;
  }

  onSave(
    event: Event,
    state: WorkflowStateGetFull,
    selectedForms: any[],
    workflowStateFormsSettings: any
  ): void {
    event.stopPropagation();
    this.saving = true;
    const data: any = {
      value: JSON.stringify(selectedForms),
      property: `iCare.programs.settings.workflowStateForms.${state?.uuid}`,
      description: `Workflow state ${state?.concept?.display} relationship with forms`,
      uuid:
        workflowStateFormsSettings && workflowStateFormsSettings?.uuid
          ? workflowStateFormsSettings?.uuid
          : null,
    };
    this.systemSettingsService
      .updateSystemSettings(data)
      .subscribe((response: any) => {
        if (response) {
          this.saving = false;
        }
      });
  }
}
