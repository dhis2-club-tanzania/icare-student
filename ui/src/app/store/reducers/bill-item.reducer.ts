import { Action, createReducer, on } from '@ngrx/store';
import { loadedBaseState } from 'src/app/store/states/base.state';
import {
  clearBillItems,
  clearPaidBillItems,
  updatePatientBillItem,
  updatePatientBillItems,
  upsertPatientBillItem,
  upsertPatientBillItems,
} from '../actions/bill-item.actions';
import {
  billItemAdapter,
  BillItemState,
  initialBillItemState,
} from '../states/bill-item.state';

const reducer = createReducer(
  initialBillItemState,
  on(upsertPatientBillItems, (state, { billItems }) =>
    billItemAdapter.upsertMany(billItems, { ...state, ...loadedBaseState })
  ),
  on(upsertPatientBillItem, (state, { billItem }) =>
    billItemAdapter.upsertOne(billItem, { ...state, ...loadedBaseState })
  ),
  on(clearBillItems, (state) => billItemAdapter.removeAll(state)),
  on(clearPaidBillItems, (state, { ids }) =>
    billItemAdapter.removeMany(ids, state)
  ),
  on(updatePatientBillItem, (state, { id, changes }) =>
    billItemAdapter.updateOne({ id, changes }, state)
  ),
  on(updatePatientBillItems, (state, { billItems }) =>
    billItemAdapter.updateMany(billItems, state)
  )
);

export function billItemReducer(
  state: BillItemState,
  action: Action
): BillItemState {
  return reducer(state, action);
}
