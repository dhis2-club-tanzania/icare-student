import { createSelector } from '@ngrx/store';
import { RequisitionObject } from 'src/app/shared/resources/store/models/requisition.model';
import { AppState, getRootState } from '../reducers';
import { requisitionAdapter, RequisitionState } from '../states';

const getRequisitionState = createSelector(
  getRootState,
  (state: AppState) => state.requisition
);

export const {
  selectAll: getAllRequisitions,
} = requisitionAdapter.getSelectors(getRequisitionState);

export const getRequisitionLoadingState = createSelector(
  getRequisitionState,
  (requisitionState: RequisitionState) => requisitionState?.loading
);

export const getRequisitionsReceived = createSelector(
  getAllRequisitions,
  (requisitions: RequisitionObject[]) =>
    (requisitions || []).filter(
      (requisition) => requisition.status === 'RECEIVED'
    )
);

export const getActiveRequisitions = createSelector(
  getAllRequisitions,
  (requisitions: RequisitionObject[]) =>
    (requisitions || []).filter(
      (requisition) => requisition.status !== 'RECEIVED'
    )
);
