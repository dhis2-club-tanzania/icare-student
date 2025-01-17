import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InpatientDashboardComponent } from "./pages/inpatient-dashboard/inpatient-dashboard.component";
import { InpatientPatientListComponent } from "./pages/inpatient-patient-list/inpatient-patient-list.component";

const routes: Routes = [
  {
    path: "",
    component: InpatientPatientListComponent,
  },
  {
    path: ":location",
    component: InpatientPatientListComponent,
  },
  {
    path: "dashboard/:patientId",
    component: InpatientDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InpatientRoutingModule {}
