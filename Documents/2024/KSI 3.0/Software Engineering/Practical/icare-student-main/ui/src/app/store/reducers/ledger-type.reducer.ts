import { Action, createReducer, on } from '@ngrx/store';
import {
  loadLedgerTypes,
  loadLedgerTypesFail,
  upsertLedgerTypes,
} from '../actions/ledger-type.actions';
import {
  initialledgerTypeState,
  ledgerTypeAdapter,
  LedgerTypeState,
} from '../states';
import { errorBaseState, loadingBaseState } from '../states/base.state';

const reducer = createReducer(
  initialledgerTypeState,
  on(loadLedgerTypes, (state) => ({ ...state, ...loadingBaseState })),
  on(loadLedgerTypesFail, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(upsertLedgerTypes, (state, { ledgerTypes }) =>
    ledgerTypeAdapter.upsertMany(ledgerTypes, state)
  )
);

export function ledgerTypeReducer(
  state: LedgerTypeState,
  action: Action
): LedgerTypeState {
  return reducer(state, action);
}
