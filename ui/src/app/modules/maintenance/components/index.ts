import { MaintenanceSideMenuComponent } from "./maintenance-side-menu/maintenance-side-menu.component";
import { ParameterConfigurationFormComponent } from "./parameter-configuration-form/parameter-configuration-form.component";
import { ProgramsWorkflowsAndFormsRelationshipComponent } from "./programs-workflows-and-forms-relationship/programs-workflows-and-forms-relationship.component";
import { ProviderAttributesFormComponent } from "./provider-attributes-form/provider-attributes-form.component";
import { ReportsGroupsListComponent } from "./reports-groups-list/reports-groups-list.component";
import { ReportsGroupsComponent } from "./reports-groups/reports-groups.component";
import { UsersListComponent } from "./users-list/users-list.component";

export const maintenanceComponents: any[] = [
  UsersListComponent,
  ProviderAttributesFormComponent,
  MaintenanceSideMenuComponent,
  ReportsGroupsComponent,
  ReportsGroupsListComponent,
  ParameterConfigurationFormComponent,
  ProgramsWorkflowsAndFormsRelationshipComponent,
];
