import { createFeatureSelector } from '@ngrx/store';
import { billAdapter, PendingBillState } from '../states/bill.state';

const getPendingBillState = createFeatureSelector<PendingBillState>(
  'pendingBill'
);

export const {
  selectAll: getAllPendingBills,
  selectEntities: getPendingBillEntities,
} = billAdapter.getSelectors(getPendingBillState);
