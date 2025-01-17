import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { radiologyComponents } from "./components";
import { radiologyContainers } from "./containers";
import { RadiologyRoutingModule } from "./radiology-routing.module";
@NgModule({
  declarations: [...radiologyContainers, ...radiologyComponents],
  entryComponents: [],
  providers: [],
  imports: [CommonModule, RadiologyRoutingModule, SharedModule],
})
export class RadiologyModule {}
