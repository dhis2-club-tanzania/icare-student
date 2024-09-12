import { LabSystemSettingsComponent } from "./lab-system-settings/lab-system-settings.component";
import { LabsAndSectionsManagementComponent } from "./labs-and-sections-management/labs-and-sections-management.component";
import { OtherLabConfigurationsComponent } from "./other-lab-configurations/other-lab-configurations.component";
import { SystemLogsComponent } from "./system-logs/system-logs.component";
import { TestOrdersManagementComponent } from "./test-orders-management/test-orders-management.component";
import { WorksheetManagementComponent } from "./worksheet-management/worksheet-management.component";

export const settingsContainers: any[] = [
  LabsAndSectionsManagementComponent,
  TestOrdersManagementComponent,
  OtherLabConfigurationsComponent,
  LabSystemSettingsComponent,
  WorksheetManagementComponent,
  SystemLogsComponent,
];
