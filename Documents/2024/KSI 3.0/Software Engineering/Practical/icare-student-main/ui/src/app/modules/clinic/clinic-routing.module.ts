import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClinicPatientListComponent } from "./pages/clinic-patient-list/clinic-patient-list.component";
import { PatientConsultationComponent } from "./pages/patient-consultation/patient-consultation.component";
import { PatientDashboardComponent } from "./pages/patient-dashboard/patient-dashboard.component";
import { PatientHomeComponent } from "./pages/patient-home/patient-home.component";

const routes: Routes = [
  {
    path: "",
    component: PatientHomeComponent,
    children: [
      { path: "", redirectTo: "patient-list", pathMatch: "full" },
      { path: "patient-list", component: ClinicPatientListComponent },
      {
        path: "patient-dashboard/:patientID",
        component: PatientDashboardComponent,
      },
      {
        path: "consultation/:patientID",
        component: PatientConsultationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicRoutingModule {}
