import { Action, createReducer, on } from '@ngrx/store';
import {
  cancelRequisition,
  cancelRequisitionFail,
  loadRequisitions,
  loadRequisitionsFail,
  receiveRequisition,
  receiveRequisitionFail,
  rejectRequisition,
  rejectRequisitionFail,
  removeRequisition,
  upsertRequisition,
  upsertRequisitions,
} from '../actions/requisition.actions';
import {
  initialRequisitionState,
  requisitionAdapter,
  RequisitionState,
} from '../states';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';

const reducer = createReducer(
  initialRequisitionState,
  on(loadRequisitions, (state) => ({ ...state, ...loadingBaseState })),
  on(loadRequisitionsFail, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(upsertRequisitions, (state, { requisitions }) =>
    requisitionAdapter.upsertMany(requisitions, {
      ...state,
      ...loadedBaseState,
    })
  ),
  on(upsertRequisition, (state, { requisition }) =>
    requisitionAdapter.upsertOne(requisition, state)
  ),
  on(cancelRequisition, (state, { id }) =>
    requisitionAdapter.updateOne(
      {
        id,
        changes: { crudOperationStatus: { status: 'CANCELLING' } },
      },
      state
    )
  ),
  on(receiveRequisition, (state, { requisition }) =>
    requisitionAdapter.updateOne(
      {
        id: requisition.id,
        changes: { crudOperationStatus: { status: 'RECEIVING' } },
      },
      state
    )
  ),

  on(rejectRequisition, (state, { id }) =>
    requisitionAdapter.updateOne(
      {
        id,
        changes: { crudOperationStatus: { status: 'REJECTING' } },
      },
      state
    )
  ),
  on(
    cancelRequisitionFail,
    receiveRequisitionFail,
    rejectRequisitionFail,
    (state, { id, error }) =>
      requisitionAdapter.updateOne(
        { id, changes: { crudOperationStatus: { status: 'FAILED', error } } },
        state
      )
  ),
  on(removeRequisition, (state, { id }) =>
    requisitionAdapter.removeOne(id, state)
  )
);

export function requisitionReducer(
  state: RequisitionState,
  action: Action
): RequisitionState {
  return reducer(state, action);
}
