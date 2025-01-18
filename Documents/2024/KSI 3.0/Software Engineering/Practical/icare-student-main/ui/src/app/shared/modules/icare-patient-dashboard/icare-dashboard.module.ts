import { NgModule } from '@angular/core';
import { materialModules } from '../../material-modules';
import { PatientDashboardHomeComponent } from './pages/patient-dashboard-home/patient-dashboard-home.component';

@NgModule({
  imports: [...materialModules],
  declarations: [PatientDashboardHomeComponent],
  providers: [],
  exports: [PatientDashboardHomeComponent],
})
export class ICarePatientDashboardModule {}
