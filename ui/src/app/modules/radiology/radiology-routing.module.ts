import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PatientRadiologyOrdersComponent } from "./containers/patient-radiology-orders/patient-radiology-orders.component";
import { RadiologyHomeComponent } from "./containers/radiology-home/radiology-home.component";

const routes: Routes = [
  {
    path: "",
    component: RadiologyHomeComponent,
  },
  {
    path: "patient/:patientId",
    component: PatientRadiologyOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RadiologyRoutingModule {}
