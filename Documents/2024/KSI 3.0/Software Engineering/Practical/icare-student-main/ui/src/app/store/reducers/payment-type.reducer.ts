import { Action, createReducer, on } from '@ngrx/store';
import {
  addPaymentTypes,
  loadPaymentTypes,
  loadPaymentTypesFails,
  setCurrentPaymentType,
} from '../actions/payment-type.actions';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';
import {
  initialPaymentTypeState,
  PaymentTypeState,
  paymentTypeAdapter,
} from '../states/payment-type.state';

const reducer = createReducer(
  initialPaymentTypeState,
  on(loadPaymentTypes, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addPaymentTypes, (state, { paymentTypes }) =>
    paymentTypeAdapter.addMany(paymentTypes, { ...state, ...loadedBaseState })
  ),
  on(loadPaymentTypesFails, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  })),
  on(setCurrentPaymentType, (state, { currentPaymentType }) => ({
    ...state,
    currentPaymentType,
  }))
);

export function paymentTypeReducer(
  state: PaymentTypeState,
  action: Action
): PaymentTypeState {
  return reducer(state, action);
}
