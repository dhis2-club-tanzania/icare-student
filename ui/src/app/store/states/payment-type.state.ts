import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PaymentTypeInterface } from 'src/app/shared/models/payment-type.model';
import { BaseState, initialBaseState } from './base.state';

export interface PaymentTypeState
  extends EntityState<PaymentTypeInterface>,
    BaseState {
  currentPaymentType: string;
}

export const paymentTypeAdapter: EntityAdapter<PaymentTypeInterface> =
  createEntityAdapter<PaymentTypeInterface>();

export const initialPaymentTypeState: PaymentTypeState =
  paymentTypeAdapter.getInitialState({
    ...initialBaseState,
    currentPaymentType: '00000100IIIIIIIIIIIIIIIIIIIIIIIIIIII',
  });
