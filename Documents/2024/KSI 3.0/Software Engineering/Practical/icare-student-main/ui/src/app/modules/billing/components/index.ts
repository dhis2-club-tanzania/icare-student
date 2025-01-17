import { BillConfirmationComponent } from './bill-confirmation/bill-confirmation.component';
import { ExemptionConfirmationComponent } from './exemption-confirmation/exemption-confirmation.component';
import { ExemptionItemComponent } from './exemption-item/exemption-item.component';
import { ExemptionListComponent } from './exemption-list/exemption-list.component';
import { PaymentReceiptComponent } from './payment-reciept/payment-reciept.component';
import { PaymentsComponent } from './payments/payments.component';
import { PendingPaymentsComponent } from './pending-payments/pending-payments.component';
import { QuotationItemComponent } from './quotation-item/quotation-item.component';
import { QuotationsComponent } from './quotations/quotations.component';
import { DiscountsComponent } from './discounts/discounts.component';
import { ExemptionHistoryComponent } from './exemption-history/exemption-history.component';
import { ExemptionDenialComponent } from './exemption-denial/exemption-denial.component';
import { ExemptionFullConfirmationComponent } from './exemption-full-confirmation/exemption-full-confirmation.component';

export const billingComponents: any[] = [
  QuotationsComponent,
  QuotationItemComponent,
  PaymentsComponent,
  BillConfirmationComponent,
  PaymentReceiptComponent,
  ExemptionListComponent,
  ExemptionItemComponent,
  ExemptionConfirmationComponent,
  PendingPaymentsComponent,
  DiscountsComponent,
  ExemptionHistoryComponent,
  ExemptionDenialComponent,
  ExemptionFullConfirmationComponent
];

export const billingEntryComponents: any[] = [
  BillConfirmationComponent,
  PaymentReceiptComponent,
  ExemptionConfirmationComponent,
  ExemptionDenialComponent,
  ExemptionFullConfirmationComponent
];
