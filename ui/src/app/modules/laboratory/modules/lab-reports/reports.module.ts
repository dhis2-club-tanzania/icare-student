import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { ReportsRoutingModule } from "./reports-routing.module";
import { components } from "./components";
import { ReportsHomeComponent } from "./pages/reports-home/reports-home.component";
import { ReportsDashboardComponent } from "./pages/reports-dashboard/reports-dashboard.component";
import { RenderReportPageComponent } from "./pages/render-report-page/render-report-page.component";

@NgModule({
  declarations: [
    ...components,
    ReportsHomeComponent,
    ReportsDashboardComponent,
    RenderReportPageComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
})
export class ReportsModule {}
