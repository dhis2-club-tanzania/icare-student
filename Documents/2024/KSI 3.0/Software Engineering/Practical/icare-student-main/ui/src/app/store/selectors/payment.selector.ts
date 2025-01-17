import { createFeatureSelector, createSelector } from '@ngrx/store';
import { paymentAdapter, PaymentState } from '../states/payment.state';

const getPaymentState = createFeatureSelector<PaymentState>('payment');

export const {
  selectAll: getAllPayments,
  selectEntities: getPaymentEntities,
} = paymentAdapter.getSelectors(getPaymentState);

export const getLoadingPaymentStatus = createSelector(
  getPaymentState,
  (state: PaymentState) => state.loading
);
