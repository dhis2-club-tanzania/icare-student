import { createSelector } from '@ngrx/store';
import { PaymentTypeInterface } from 'src/app/shared/models/payment-type.model';
import { AppState, getRootState } from '../reducers';
import {
  paymentTypeAdapter,
  PaymentTypeState,
} from '../states/payment-type.state';
import { flatten } from 'lodash';

const getPaymentTypeState = createSelector(
  getRootState,
  (state: AppState) => state.paymentType
);

export const {
  selectAll: getAllPaymentTypes,
  selectEntities: getPaymentTypeEntities,
} = paymentTypeAdapter.getSelectors(getPaymentTypeState);

const getCurrentPaymentTypeId = createSelector(
  getPaymentTypeState,
  (state: PaymentTypeState) => state.currentPaymentType
);

export const getCurrentPaymentType = createSelector(
  getPaymentTypeEntities,
  getCurrentPaymentTypeId,
  (paymentTypeEntities, currentPaymentTypeId) =>
    paymentTypeEntities ? paymentTypeEntities[currentPaymentTypeId] : null
);

export const getPaymentSchemes = createSelector(
  getCurrentPaymentType,
  (currentPaymentType: PaymentTypeInterface) =>
    currentPaymentType?.paymentSchemes
);

export const getPaymentTypeLoadingState = createSelector(
  getPaymentTypeState,
  (paymentTypeState: PaymentTypeState) => paymentTypeState?.loading
);
