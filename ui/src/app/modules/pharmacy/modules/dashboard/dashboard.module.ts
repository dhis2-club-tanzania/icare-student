import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { pages } from "./pages";
import { components } from "./components";
import { DashboardRoutingModule } from "./dashboard-routing.module";

@NgModule({
  declarations: [...pages, ...components],
  entryComponents: [],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
