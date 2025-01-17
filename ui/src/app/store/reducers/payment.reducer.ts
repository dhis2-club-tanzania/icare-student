import { Action, createReducer, on } from '@ngrx/store';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from 'src/app/store/states/base.state';
import {
  clearPayments,
  loadPatientPaymentFail,
  loadPatientPayments,
  upsertPatientPayments,
} from '../actions/payment.actions';
import {
  initialPaymentState,
  paymentAdapter,
  PaymentState,
} from '../states/payment.state';

const reducer = createReducer(
  initialPaymentState,
  on(loadPatientPayments, (state) => ({ ...state, ...loadingBaseState })),
  on(upsertPatientPayments, (state, { payments }) =>
    paymentAdapter.upsertMany(payments, { ...state, ...loadedBaseState })
  ),
  on(clearPayments, (state) => paymentAdapter.removeAll(state)),
  on(loadPatientPaymentFail, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  }))
);

export function paymentReducer(
  state: PaymentState,
  action: Action
): PaymentState {
  return reducer(state, action);
}
