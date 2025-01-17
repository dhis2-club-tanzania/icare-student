import { CurrentPatientDispensingComponent } from './current-patient-dispensing/current-patient-dispensing.component';
import { DispensingDashboardComponent } from './dispensing-dashboard/dispensing-dashboard.component';
import { DispensingHomeComponent } from './dispensing-home/dispensing-home.component';
import { DispensingPatientListComponent } from './dispensing-patient-list/dispensing-patient-list.component';

export const dispensingPages: any[] = [
  DispensingHomeComponent,
  DispensingDashboardComponent,
  DispensingPatientListComponent,
  CurrentPatientDispensingComponent,
];
