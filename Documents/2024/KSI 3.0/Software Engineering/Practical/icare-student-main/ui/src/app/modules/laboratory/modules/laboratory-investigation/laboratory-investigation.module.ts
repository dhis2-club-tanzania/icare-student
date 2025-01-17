import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { LabInvestigationRoutingModule } from './laboratory-investigation-routing.module';
import { investigationComponents } from './containers/laboratory-investigation-home';
import { labInvestigationComponents } from './components';
@NgModule({
  declarations: [...investigationComponents, ...labInvestigationComponents],
  imports: [CommonModule, LabInvestigationRoutingModule, SharedModule],
})
export class LaboratoryInvestigationModule {}
