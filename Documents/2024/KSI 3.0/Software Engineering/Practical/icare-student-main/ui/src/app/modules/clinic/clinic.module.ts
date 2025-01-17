import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicRoutingModule } from './clinic-routing.module';
import { clinicPages } from './pages';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [...clinicPages],
  providers: [],
  imports: [CommonModule, ClinicRoutingModule, SharedModule],
})
export class ClinicModule {}
