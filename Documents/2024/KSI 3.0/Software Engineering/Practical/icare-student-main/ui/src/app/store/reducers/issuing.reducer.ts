import { Action, createReducer, on } from '@ngrx/store';
import {
  issueRequest,
  issueRequestFail,
  loadIssuings,
  loadIssuingsFail,
  rejectRequisition,
  rejectRequisitionFail,
  removeIssue,
  upsertIssuings,
} from '../actions/issuing.actions';
import { initialIssuingState, issuingAdapter, IssuingState } from '../states';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';

const reducer = createReducer(
  initialIssuingState,
  on(loadIssuings, (state) => ({ ...state, ...loadingBaseState })),
  on(loadIssuingsFail, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(upsertIssuings, (state, { issuings }) =>
    issuingAdapter.upsertMany(issuings, { ...state, ...loadedBaseState })
  ),
  on(issueRequest, (state, { id }) =>
    issuingAdapter.updateOne(
      { id, changes: { crudOperations: { status: 'ISSUING' } } },
      state
    )
  ),
  on(rejectRequisition, (state, { id }) =>
    issuingAdapter.updateOne(
      { id, changes: { crudOperations: { status: 'REJECTING' } } },
      state
    )
  ),
  on(issueRequestFail, rejectRequisitionFail, (state, { id, error }) =>
    issuingAdapter.updateOne(
      { id, changes: { crudOperations: { status: 'FAILED', error } } },
      state
    )
  ),
  on(removeIssue, (state, { id }) => issuingAdapter.removeOne(id, state))
);

export function issuingReducer(
  state: IssuingState,
  action: Action
): IssuingState {
  return reducer(state, action);
}
