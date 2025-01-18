import { PatientEditComponent } from "./patient-edit/patient-edit.component";
import { RegisterNewClientHomeComponent } from "./register-new-client-home/register-new-client-home.component";
import { RegistrationAddComponent } from "./registration-add/registration-add.component";
import { RegistrationHomeComponent } from "./registration-home/registration-home.component";
import { VisitComponent } from "./visit/visit.component";

export const registrationPages: any[] = [
  RegistrationHomeComponent,
  VisitComponent,
  RegistrationAddComponent,
  PatientEditComponent,
  RegisterNewClientHomeComponent,
];
