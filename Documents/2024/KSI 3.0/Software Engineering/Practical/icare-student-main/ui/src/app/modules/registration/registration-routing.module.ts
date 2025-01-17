import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PatientsListByLocationComponent } from "src/app/shared/components/patients-list-by-location/patients-list-by-location.component";
import { RegistrationPatientComponent } from "./components/registration-patient/registration-patient.component";
import { RegistrationSearchComponent } from "./components/registration-search/registration-search.component";
import { PatientEditComponent } from "./pages/patient-edit/patient-edit.component";
import { RegisterNewClientHomeComponent } from "./pages/register-new-client-home/register-new-client-home.component";
import { RegistrationAddComponent } from "./pages/registration-add/registration-add.component";
import { RegistrationHomeComponent } from "./pages/registration-home/registration-home.component";
import { VisitComponent } from "./pages/visit/visit.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home",
  },
  {
    path: "",
    component: RegistrationHomeComponent,
    children: [
      {
        path: "home",
        component: RegistrationSearchComponent,
      },
      {
        path: "patient",
        component: RegistrationPatientComponent,
      },
    ],
  },
  {
    path: "visit",
    component: VisitComponent,
  },
  {
    path: "add",
    component: RegisterNewClientHomeComponent,
  },
  {
    path: "edit/:patientId",
    component: PatientEditComponent,
  },
  {
    path: "patients-list/location/:location",
    component: PatientsListByLocationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}
