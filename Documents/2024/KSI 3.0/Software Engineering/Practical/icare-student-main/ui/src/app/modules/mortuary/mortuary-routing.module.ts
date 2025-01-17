import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MortuaryHomeComponent } from './pages/mortuary-home/mortuary-home.component';
const routes: Routes = [
  {
    path: '',
    component: MortuaryHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MortuaryRoutingModule {}
