import { createSelector } from '@ngrx/store';
import { AppState, getRootState, } from '../reducers';
import { LabOrdersBillingInfoState } from '../states';

const getLabOrdersBillingInfoState = createSelector(
  getRootState,
  (state: AppState) => state.labOrdersBillingInfo
);

export const getLabOrdersBillingInfoLoadedState = createSelector(
  getLabOrdersBillingInfoState,
  (state: LabOrdersBillingInfoState) => state.loaded
);

export const getLabOrdersBillingInfo = createSelector(
  getLabOrdersBillingInfoState,
  (state: LabOrdersBillingInfoState) => state.labOrdersBillingInfo
);
