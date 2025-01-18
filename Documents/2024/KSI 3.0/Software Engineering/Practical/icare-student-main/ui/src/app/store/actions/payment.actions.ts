import { createAction, props } from '@ngrx/store';
import { PaymentObject } from 'src/app/modules/billing/models/payment-object.model';

export const loadPatientPayments = createAction(
  '[Payment] Load patient payments',
  props<{ patientUuid: string; isRegistrationPage?: boolean }>()
);

export const loadPatientPaymentFail = createAction(
  '[Payment] Load patient payments fail',
  props<{ error: any }>()
);

export const upsertPatientPayments = createAction(
  '[Payment] Upsert patient payments',
  props<{ payments: PaymentObject[] }>()
);

export const clearPayments = createAction('[Payment] Clear payments');
