import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TheatreDashboardComponent } from "./pages/theatre-dashboard/theatre-dashboard.component";
import { TheatreHomeComponent } from "./pages/theatre-home/theatre-home.component";
const routes: Routes = [
  {
    path: "",
    component: TheatreHomeComponent,
  },
  {
    path: "patient-theatre/:patient",
    component: TheatreDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TheatreRoutingModule {}
