import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { dhis2Containers } from "./containers";
import { DHIS2RoutingModule } from "./dhis2-routing.module";
@NgModule({
  declarations: [...dhis2Containers],
  entryComponents: [],
  providers: [],
  imports: [CommonModule, DHIS2RoutingModule],
})
export class DHIS2Module {}
