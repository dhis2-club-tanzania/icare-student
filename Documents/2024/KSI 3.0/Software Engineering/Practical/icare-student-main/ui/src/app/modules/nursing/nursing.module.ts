import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { nursingComponents } from './components';
import { NursingRoutingModule } from './nursing-routing.module';
import { nursingPages } from './pages';

@NgModule({
  declarations: [...nursingPages, ...nursingComponents],
  entryComponents: [],
  providers: [],
  imports: [CommonModule, NursingRoutingModule, SharedModule],
})
export class NursingModule {}
