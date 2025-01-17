import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PaymentObject } from 'src/app/modules/billing/models/payment-object.model';
import { BaseState, initialBaseState } from 'src/app/store/states/base.state';
export interface PaymentState extends EntityState<PaymentObject>, BaseState {}

export const paymentAdapter: EntityAdapter<PaymentObject> = createEntityAdapter<
  PaymentObject
>();

export const initialPaymentState: PaymentState = paymentAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
