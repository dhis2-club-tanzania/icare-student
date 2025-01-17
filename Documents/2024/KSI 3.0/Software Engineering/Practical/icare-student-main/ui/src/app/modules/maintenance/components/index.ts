import { DrugsListComponent } from "./drugs-list/drugs-list.component";
import { GenericDrugsListComponent } from "./generic-drugs-list/generic-drugs-list.component";
import { MaintenanceSideMenuComponent } from "./maintenance-side-menu/maintenance-side-menu.component";
import { ParameterConfigurationFormComponent } from "./parameter-configuration-form/parameter-configuration-form.component";
import { ProviderAttributesFormComponent } from "./provider-attributes-form/provider-attributes-form.component";
import { ReportsGroupsListComponent } from "./reports-groups-list/reports-groups-list.component";
import { ReportsGroupsComponent } from "./reports-groups/reports-groups.component";
import { SystemSettingsListComponent } from "./system-settings-list/system-settings-list.component";
import { UsersListComponent } from "./users-list/users-list.component";

export const maintenanceComponents: any[] = [
  UsersListComponent,
  ProviderAttributesFormComponent,
  MaintenanceSideMenuComponent,
  SystemSettingsListComponent,
  GenericDrugsListComponent,
  DrugsListComponent,
  ReportsGroupsComponent,
  ReportsGroupsListComponent,
  ParameterConfigurationFormComponent,
];
