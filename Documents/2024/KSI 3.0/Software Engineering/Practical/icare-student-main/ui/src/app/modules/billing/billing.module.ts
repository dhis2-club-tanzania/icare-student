import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillingRoutingModule } from './billing-routing.module';
import { billingComponents, billingEntryComponents } from './components';
import { BillingSearchComponent } from './components/billing-search/billing-search.component';
import { HomeComponent } from './containers/home/home.component';
import { billingPages } from './pages';
import { billingServices } from './services';

@NgModule({
  declarations: [
    HomeComponent,
    BillingSearchComponent,
    ...billingPages,
    ...billingComponents,
  ],
  entryComponents: [...billingEntryComponents],
  providers: [...billingServices],
  imports: [CommonModule, BillingRoutingModule, SharedModule],
})
export class BillingModule {}
