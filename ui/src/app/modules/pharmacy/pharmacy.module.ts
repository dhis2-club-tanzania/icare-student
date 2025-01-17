import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { PharmacyRoutingModule } from "./pharmacy-routing.module";
import { PharmacyComponent } from "./containers/pharmacy/pharmacy.component";

@NgModule({
  declarations: [PharmacyComponent],
  imports: [CommonModule, PharmacyRoutingModule, SharedModule],
  bootstrap: [PharmacyComponent],
})
export class PharmacyModule {}
