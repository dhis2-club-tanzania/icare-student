import { Action, createReducer, on } from '@ngrx/store';
import { upsertPatientPendingBill } from '../actions/bill.actions';
import {
  billAdapter,
  initialPendingBillState,
  PendingBillState,
} from '../states/bill.state';

const reducer = createReducer(
  initialPendingBillState,
  on(upsertPatientPendingBill, (state, { bill }) =>
    billAdapter.upsertOne(bill, state)
  )
);

export function pendingBillReducer(
  state: PendingBillState,
  action: Action
): PendingBillState {
  return reducer(state, action);
}
