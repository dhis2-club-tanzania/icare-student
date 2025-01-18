import { Component, Input, OnInit } from "@angular/core";
import { Location } from "src/app/core/models";
import { WorkflowStateGetFull } from "src/app/shared/resources/openmrs";

@Component({
  selector: "app-workflow-state-forms",
  templateUrl: "./workflow-state-forms.component.html",
  styleUrls: ["./workflow-state-forms.component.scss"],
})
export class WorkflowStateFormsComponent implements OnInit {
  @Input() forms: any;
  @Input() workflowState: WorkflowStateGetFull;
  @Input() patientEnrollmentDetails: any;
  @Input() currentLocation: Location;
  @Input() provider: any;
  @Input() patientWorkflowState: any;
  constructor() {}

  ngOnInit(): void {}
}
