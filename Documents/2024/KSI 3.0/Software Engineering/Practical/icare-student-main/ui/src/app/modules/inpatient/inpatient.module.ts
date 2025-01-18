import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { inpatientComponents } from './components';
import { InpatientRoutingModule } from './inpatient-routing.module';
import { inpatientPages } from './pages';
@NgModule({
  declarations: [...inpatientPages, ...inpatientComponents],
  entryComponents: [],
  providers: [],
  imports: [CommonModule, InpatientRoutingModule, SharedModule],
})
export class InpatientModule {}
