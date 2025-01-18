import { BatchRegistrationComponent } from "./batch-registration/batch-registration.component";
import { BatchSamplesListComponent } from "./batch-samples-list/batch-samples-list.component";
import { ClientsFromExternalSystemsComponent } from "./clients-from-external-systems/clients-from-external-systems.component";
import { ClinicalDataComponent } from "./clinical-data/clinical-data.component";
import { DynamicOpenmrsRegistrationDashboardComponent } from "./dynamic-openmrs-registration-dashboard/dynamic-openmrs-registration-dashboard.component";
import { DynamicOpenmrsRegistrationFormComponent } from "./dynamic-openmrs-registration-form/dynamic-openmrs-registration-form.component";
import { LbOptionSelectorComponent } from "./lb-option-selector/lb-option-selector.component";
import { MultipleTestsSelectionComponent } from "./multiple-tests-selection/multiple-tests-selection.component";
import { PersonDetailsComponent } from "./person-details/person-details.component";
import { RegisterSampleComponent } from "./register-sample/register-sample.component";
import { RegisteredPatientDetailsComponent } from "./registered-patient-details/registered-patient-details.component";
import { RenderOpenmrsFormComponent } from "./render-openmrs-form/render-openmrs-form.component";
import { SampleInBatchRegistrationComponent } from "./sample-in-batch-registration/sample-in-batch-registration.component";
import { SampleLabelComponent } from "./sample-label/sample-label.component";
import { SampleRegistrationFinalizationComponent } from "./sample-registration-finalization/sample-registration-finalization.component";
import { SamplesListComponent } from "./samples-list/samples-list.component";
import { SingleRegistrationComponent } from "./single-registration/single-registration.component";

export const sampleRegistrationComponents: any[] = [
  RegisterSampleComponent,
  SingleRegistrationComponent,
  BatchRegistrationComponent,
  SampleLabelComponent,
  LbOptionSelectorComponent,
  PersonDetailsComponent,
  ClinicalDataComponent,
  RegisteredPatientDetailsComponent,
  MultipleTestsSelectionComponent,
  SampleRegistrationFinalizationComponent,
  ClientsFromExternalSystemsComponent,
  SamplesListComponent,
  SampleInBatchRegistrationComponent,
  BatchSamplesListComponent,
  DynamicOpenmrsRegistrationDashboardComponent,
  DynamicOpenmrsRegistrationFormComponent,
  RenderOpenmrsFormComponent,
];

export const regModals: any[] = [SampleRegistrationFinalizationComponent];
