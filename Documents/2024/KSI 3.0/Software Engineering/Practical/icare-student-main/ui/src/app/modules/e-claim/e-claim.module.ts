import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EClaimRoutingModule } from './e-claim-routing.module';
import { eClaimPages } from './pages';
import { eClaimContainers } from './containers';

@NgModule({
  declarations: [...eClaimPages, ...eClaimContainers],
  imports: [CommonModule, EClaimRoutingModule, SharedModule],
})
export class EClaimModule {}
