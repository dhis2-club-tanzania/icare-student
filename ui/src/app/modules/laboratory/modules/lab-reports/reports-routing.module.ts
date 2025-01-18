import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RenderReportPageComponent } from "./pages/render-report-page/render-report-page.component";
import { ReportsDashboardComponent } from "./pages/reports-dashboard/reports-dashboard.component";
import { ReportsHomeComponent } from "./pages/reports-home/reports-home.component";

const routes: Routes = [
  {
    path: "",
    component: ReportsHomeComponent,
    children: [
      {
        path: "",
        component: ReportsDashboardComponent,
      },
      {
        path: ":id",
        component: RenderReportPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
