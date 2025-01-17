import { createSelector } from '@ngrx/store';
import { AppState, getRootState } from '../reducers';
import { ledgerTypeAdapter, LedgerTypeState } from '../states';

const getLedgerTypeState = createSelector(
  getRootState,
  (state: AppState) => state.ledgerType
);

export const { selectAll: getAllLedgerTypes } = ledgerTypeAdapter.getSelectors(
  getLedgerTypeState
);

export const getLedgerTypeLoadingState = createSelector(
  getLedgerTypeState,
  (ledgerTypeState: LedgerTypeState) => ledgerTypeState?.loading
);
