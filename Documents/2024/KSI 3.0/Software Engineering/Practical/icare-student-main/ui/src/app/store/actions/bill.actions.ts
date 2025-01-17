import { createAction, props } from '@ngrx/store';
import { BillItem } from 'src/app/modules/billing/models/bill-item.model';
import { BillObject } from 'src/app/modules/billing/models/bill-object.model';
import { PaymentInput } from 'src/app/modules/billing/models/payment-input.model';
import { Patient } from 'src/app/shared/resources/patient/models/patient.model';
export const loadPatientBills = createAction(
  '[Billing] Load patient bills',
  props<{ patientUuid: string; isRegistrationPage?: boolean }>()
);

export const loadPatientBillFail = createAction(
  '[Billing] Load patient bills fail',
  props<{ error: any }>()
);

export const upsertPatientBills = createAction(
  '[Billing] Upsert patient bills',
  props<{ bills: BillObject[] }>()
);

export const upsertPatientBill = createAction(
  '[Billing] Upsert patient bill',
  props<{ bill: BillObject }>()
);

export const upsertPatientPendingBill = createAction(
  '[Billing] Upsert patient pending bill',
  props<{ bill: BillObject }>()
);

export const confirmPatientBill = createAction(
  '[Billing] Confirm patient bill',
  props<{ bill: BillObject; paymentInput: PaymentInput }>()
);

export const discountBill = createAction(
  '[Billing] discount bill',
  props<{ bill: BillObject; discountDetails: any; patient: Patient }>()
);

export const discountBillFail = createAction(
  '[Billing] Discount bill fail',
  props<{ bill: BillObject; error: any }>()
);

export const confirmPatientBillSuccess = createAction(
  '[Billing] Confirm patient bill success',
  props<{ bill: BillObject; status: 'PENDING' | 'PAID'; items?: BillItem[] }>()
);

export const discountPatientBillSuccess = createAction(
  '[Billing] Discount patient bill success',
  props<{ bill: BillObject }>()
);

export const confirmPatientBillFail = createAction(
  '[Billing] Confirm patient bill fail',
  props<{ bill: BillObject; error: any }>()
);

export const clearBills = createAction('[Billing] Clear bills');

export const showPaymentReceipt = createAction(
  '[Billing] show payment receipt',
  props<{ receiptData: any; paymentType?: any }>()
);
