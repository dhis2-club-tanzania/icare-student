import { createAction, props } from '@ngrx/store';

export const initiatePaymentTypes = createAction(
  '[PaymentType] initiate payment types',
  props<{ paymentCategories: any[] }>()
);

export const loadPaymentTypes = createAction(
  '[PaymentType] load payment types',
  props<{ paymentCategories: any[] }>()
);

export const addPaymentTypes = createAction(
  '[PaymentType] add payment types',
  props<{ paymentTypes: any }>()
);

export const loadPaymentTypesFails = createAction(
  '[PaymentType] loading payment types fails',
  props<{ error: any }>()
);

export const setCurrentPaymentType = createAction(
  '[PaymentType] Set current payment type',
  props<{ currentPaymentType: string }>()
);
