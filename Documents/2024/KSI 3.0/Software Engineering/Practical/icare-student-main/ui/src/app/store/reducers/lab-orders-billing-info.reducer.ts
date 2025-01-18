import { createReducer, on } from '@ngrx/store';
import { initialLabOrdersBillingInfo } from '../states';
import {
  loadLabOrdersBillingInformation,
  addLoadedLabOrdersBillingInfo,
  loadingLabOrderBillingInfoFails,
  getBillingInfoByVisitUuid,
  getBillingInfoBymRNo,
} from '../actions';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState,
} from '../states/base.state';

const reducer = createReducer(
  initialLabOrdersBillingInfo,
  on(loadLabOrdersBillingInformation, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedLabOrdersBillingInfo, (state, { ordersBillingInfo }) => ({
    ...state,
    ...loadedBaseState,
    labOrdersBillingInfo: ordersBillingInfo,
  })),
  on(loadingLabOrderBillingInfoFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(getBillingInfoBymRNo, (state) => ({
    ...state,
    ...loadingBaseState,
  }))
);

export function labOrdersBillingInfoReducer(state, action) {
  return reducer(state, action);
}
