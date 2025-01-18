import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardHomeComponent } from "./pages/dashboard-home/dashboard-home.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardHomeComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
