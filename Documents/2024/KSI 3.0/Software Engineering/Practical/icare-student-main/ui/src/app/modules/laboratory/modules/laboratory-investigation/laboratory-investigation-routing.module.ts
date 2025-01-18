import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderLabTestHomeComponent } from './components/order-lab-test-home/order-lab-test-home.component';
import { OrderLabTestComponent } from './components/order-lab-test/order-lab-test.component';
import { LaboratoryInvestigationHomeComponent } from './containers/laboratory-investigation-home/laboratory-investigation-home.component';

const routes: Routes = [
  {
    path: '',
    component: LaboratoryInvestigationHomeComponent,
  },
  {
    path: 'order-tests/:patientId',
    component: OrderLabTestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabInvestigationRoutingModule {}
