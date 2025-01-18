import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PharmacyDashboardHomeComponent } from "./pages/pharmacy-dashboard-home/pharmacy-dashboard-home.component";
const routes: Routes = [
  {
    path: "",
    component: PharmacyDashboardHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
