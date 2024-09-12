import { ActiveDiagnosesComponent } from "./active-diagnoses/active-diagnoses.component";
import { ClinicalNotesComponent } from "./clinical-notes/clinical-notes.component";
import { DiagnosisComponent } from "./diagnosis/diagnosis.component";
import { EnrolledPatientsListComponent } from "./enrolled-patients-list/enrolled-patients-list.component";
import { GeneralClientProgramFormsComponent } from "./general-client-program-forms/general-client-program-forms.component";
import { InvestigationProcedureComponent } from "./investigation-procedure/investigation-procedure.component";
import { OrdersOptionsFormComponent } from "./orders-options-form/orders-options-form.component";
import { PrescriptionComponent } from "./prescription/prescription.component";
import { RenderLoadedClientsListComponent } from "./render-loaded-clients-list/render-loaded-clients-list.component";
import { WorkflowStateFormDataComponent } from "./workflow-state-form-data/workflow-state-form-data.component";
import { WorkflowStateFormsComponent } from "./workflow-state-forms/workflow-state-forms.component";
import { WorkflowStateComponent } from "./workflow-state/workflow-state.component";

export const clinicComponents: any[] = [
  ActiveDiagnosesComponent,
  OrdersOptionsFormComponent,
  ClinicalNotesComponent,
  PrescriptionComponent,
  DiagnosisComponent,
  InvestigationProcedureComponent,
  EnrolledPatientsListComponent,
  WorkflowStateComponent,
  WorkflowStateFormDataComponent,
  WorkflowStateFormsComponent,
  GeneralClientProgramFormsComponent,
  RenderLoadedClientsListComponent,
];
