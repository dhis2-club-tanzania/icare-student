import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../shared/shared.module";
import { DispensingRoutingModule } from "./dispensing-routing.module";
import { dispensingPages } from "./pages";
import { dispensingComponents } from "./components";
import { dispensingModals } from "./modals";

@NgModule({
    declarations: [
        ...dispensingPages,
        ...dispensingComponents,
        ...dispensingModals,
    ],
    imports: [CommonModule, SharedModule, DispensingRoutingModule]
})
export class DispensingModule {}
