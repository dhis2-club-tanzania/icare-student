import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Dhis2HomeComponent } from "./containers/dhis2-home/dhis2-home.component";

const routes: Routes = [
  {
    path: "",
    component: Dhis2HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DHIS2RoutingModule {}
