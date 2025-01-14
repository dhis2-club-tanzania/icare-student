import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MortuaryHomeComponent } from "./pages/mortuary-home/mortuary-home.component";
import { MortuaryDashboardComponent } from "./pages/mortuary-dashboard/mortuary-dashboard.component";
const routes: Routes = [
  {
    path: "",
    component: MortuaryHomeComponent,
  },
  {
    path: "dashboard/:patient/:visit",
    component: MortuaryDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MortuaryRoutingModule {}
