import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NursingDataHomeComponent } from './pages/nursing-data-home/nursing-data-home.component';
import { NursingHomeComponent } from './pages/nursing-home/nursing-home.component';

const routes: Routes = [
  {
    path: '',
    component: NursingHomeComponent,
  },
  {
    path: 'consult',
    component: NursingDataHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NursingRoutingModule {}
