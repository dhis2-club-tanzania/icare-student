import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { maintenanceComponents } from "./components";
import { maintenanceContainers } from "./containers";
import { MaintenanceRoutingModule } from "./maintenance-routing.module";
import { maintenanceModals } from "./modals";
import { maintenancePages } from "./pages";

@NgModule({
  declarations: [
    ...maintenancePages,
    ...maintenanceModals,
    ...maintenanceComponents,
    ...maintenanceContainers,
  ],
  entryComponents: [...maintenanceModals],
  providers: [],
  imports: [CommonModule, MaintenanceRoutingModule, SharedModule],
})
export class MaintenanceModule {}
