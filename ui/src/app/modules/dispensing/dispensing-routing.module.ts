import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentPatientDispensingComponent } from './pages/current-patient-dispensing/current-patient-dispensing.component';
import { DispensingHomeComponent } from './pages/dispensing-home/dispensing-home.component';
import { DispensingPatientListComponent } from './pages/dispensing-patient-list/dispensing-patient-list.component';

const routes: Routes = [
  {
    path: '',
    component: DispensingPatientListComponent,
  },
  { path: ':id/:visitId', component: CurrentPatientDispensingComponent },
  { path: 'dispense', component: DispensingHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DispensingRoutingModule {}
