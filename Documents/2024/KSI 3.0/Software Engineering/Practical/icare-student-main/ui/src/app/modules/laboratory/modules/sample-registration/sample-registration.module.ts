import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { SampleRegistrationRoutingModule } from "./sample-registration-routing.module";
import { sampleRegistrationPages } from "./pages";
import { regModals, sampleRegistrationComponents } from "./components";
import { SharedLabModule } from "../../shared/modules/shared-lab.module";

@NgModule({
  imports: [
    CommonModule,
    SampleRegistrationRoutingModule,
    SharedModule,
    SharedLabModule,
  ],
  declarations: [...sampleRegistrationPages, ...sampleRegistrationComponents],
  exports: [...sampleRegistrationPages, ...sampleRegistrationComponents],
  entryComponents: [...regModals],
})
export class SampleRegistrationModule {}
