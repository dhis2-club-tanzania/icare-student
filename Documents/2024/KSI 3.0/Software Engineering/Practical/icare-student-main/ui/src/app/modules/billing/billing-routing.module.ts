import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingListComponent } from './pages/billing-list/billing-list.component';
import { CurrentPatientBillingComponent } from './pages/current-patient-billing/current-patient-billing.component';
import { ExemptionHomeComponent } from './pages/exemption-home/exemption-home.component';
import { ExemptionComponent } from './pages/exemption/exemption.component';

const routes: Routes = [
  {
    path: '',
    component: BillingListComponent,
  },
  {
    path: ':patientId/bills',
    component: CurrentPatientBillingComponent,
  },
  { path: 'exemption', component: ExemptionHomeComponent },
  { path: ':patientId/exempt', component: ExemptionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
