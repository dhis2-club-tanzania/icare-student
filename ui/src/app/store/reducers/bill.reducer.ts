import { isNgTemplate } from '@angular/compiler';
import { Action, createReducer, on } from '@ngrx/store';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from 'src/app/store/states/base.state';
import {
  clearBills,
  confirmPatientBill,
  loadPatientBillFail,
  loadPatientBills,
  upsertPatientBill,
  upsertPatientBills,
  confirmPatientBillSuccess,
  confirmPatientBillFail,
  discountBill,
  discountBillFail,
  discountPatientBillSuccess,
} from '../actions/bill.actions';
import { billAdapter, BillState, initialBillState } from '../states/bill.state';

const reducer = createReducer(
  initialBillState,
  on(loadPatientBills, (state) => ({ ...state, ...loadingBaseState })),
  on(upsertPatientBills, (state, { bills }) =>
    billAdapter.upsertMany(bills, { ...state, ...loadedBaseState })
  ),
  on(clearBills, (state) => billAdapter.removeAll(state)),
  on(loadPatientBillFail, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  })),
  on(confirmPatientBill, discountBill, (state, { bill }) =>
    billAdapter.updateOne({ id: bill.id, changes: { confirming: true } }, state)
  ),
  on(confirmPatientBillSuccess, (state, { bill, status }) => {
    const currentBill = state?.entities[bill.id];
    const confirmedItems = (bill?.items || []).filter((item) => item.confirmed);

    const remainingBillItems = (currentBill?.items || []).filter((item) =>
      confirmedItems?.some((confirmedItem) => confirmedItem.id !== item.id)
    );

    if (remainingBillItems.length === 0) {
      return billAdapter.removeOne(bill.id, state);
    }

    return billAdapter.updateOne(
      {
        id: bill.id,
        changes: { confirming: false, items: remainingBillItems },
      },
      state
    );
  }),
  on(discountPatientBillSuccess, (state, { bill }) => {
    return billAdapter.updateOne(
      { id: bill.id, changes: { confirming: false, items: bill?.items } },
      state
    );
  }),
  on(confirmPatientBillFail, discountBillFail, (state, { bill, error }) =>
    billAdapter.updateOne(
      { id: bill.id, changes: { confirming: false, error } },
      state
    )
  )
);

export function billReducer(state: BillState, action: Action): BillState {
  return reducer(state, action);
}
