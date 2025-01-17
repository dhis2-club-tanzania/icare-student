import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StoreRoutingModule } from "./store-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { StoreHomePageComponent } from "./pages/store-home-page/store-home-page.component";

@NgModule({
    declarations: [StoreHomePageComponent],
    imports: [CommonModule, StoreRoutingModule, SharedModule]
})
export class StoreModule {}
