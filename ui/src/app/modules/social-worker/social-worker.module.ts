import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './containers/home/home.component';
import { BillingSearchComponent } from './components/billing-search/billing-search.component';
import { SocialWorkerRoutingModule } from './social-worker-routing.module';

@NgModule({
  declarations: [HomeComponent, BillingSearchComponent],
  imports: [CommonModule, SocialWorkerRoutingModule, SharedModule]
})
export class SocialWorkerModule {}
