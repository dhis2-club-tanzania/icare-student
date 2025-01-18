import { BillingHomeComponent } from './billing-home/billing-home.component';
import { BillingListComponent } from './billing-list/billing-list.component';
import { CurrentPatientBillingComponent } from './current-patient-billing/current-patient-billing.component';
import { ExemptionHomeComponent } from './exemption-home/exemption-home.component';
import { ExemptionComponent } from './exemption/exemption.component';

export const billingPages: any[] = [
  BillingListComponent,
  BillingHomeComponent,
  ExemptionHomeComponent,
  ExemptionComponent,
  CurrentPatientBillingComponent,
];
