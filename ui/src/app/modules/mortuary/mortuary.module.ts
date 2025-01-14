import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { mortuaryComponents } from "./components";
import { MortuaryRoutingModule } from "./mortuary-routing.module";
import { mortuaryPages } from "./pages";
import { dialogs } from "./modals";
@NgModule({
  declarations: [...mortuaryPages, ...mortuaryComponents, ...dialogs],
  entryComponents: [...dialogs],
  providers: [],
  imports: [CommonModule, MortuaryRoutingModule, SharedModule],
})
export class MortuaryModule {}
