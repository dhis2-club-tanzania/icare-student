import { createSelector } from '@ngrx/store';
import { AppState, getRootState } from '../reducers';
import { issuingAdapter, IssuingState } from '../states';

const getIssuingState = createSelector(
  getRootState,
  (state: AppState) => state.issuing
);

export const { selectAll: getAllIssuings } = issuingAdapter.getSelectors(
  getIssuingState
);

export const getIssuingLoadingState = createSelector(
  getIssuingState,
  (issuingState: IssuingState) => issuingState?.loading
);
