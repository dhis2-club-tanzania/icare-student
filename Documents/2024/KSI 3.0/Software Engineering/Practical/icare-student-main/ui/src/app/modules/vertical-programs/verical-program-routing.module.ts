import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientConsultationComponent } from './pages/patient-consultation/patient-consultation.component';
import { PatientDashboardComponent } from './pages/patient-dashboard/patient-dashboard.component';
import { PatientHomeComponent } from './pages/patient-home/patient-home.component';
import { VerticalProgramsPatientListComponent } from './pages/vertical-program-patient-list/vertical-program-patient-list.component';

const routes: Routes = [
  {
    path: '',
    component: PatientHomeComponent,
    children: [
      { path: '', redirectTo: 'patient-list', pathMatch: 'full' },
      { path: 'patient-list', component: VerticalProgramsPatientListComponent },
      {
        path: 'dashboard',
        component: PatientDashboardComponent,
      },
      {
        path: 'consultation',
        component: PatientConsultationComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerticalProgramsRoutingModule {}
