import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EClaimHomeComponent } from './pages/e-claim-home/e-claim-home.component';
import { SubmitEClaimComponent } from './pages/submit-e-claim/submit-e-claim.component';

const routes: Routes = [
  {
    path: '',
    component: EClaimHomeComponent,
  },
  {
    path: ':patientId/submit',
    component: SubmitEClaimComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EClaimRoutingModule {}
