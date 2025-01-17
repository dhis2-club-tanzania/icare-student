import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { pages } from "./pages";

@NgModule({
  declarations: [...pages],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
