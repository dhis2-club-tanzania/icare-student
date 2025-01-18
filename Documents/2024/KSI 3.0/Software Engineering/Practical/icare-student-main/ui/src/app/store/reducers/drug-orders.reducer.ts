import { createReducer, on } from '@ngrx/store';
import { initialDrugsOrdersState, drugOrderAdapter } from '../states';
import {
  addDrugsOrdered,
  removeDrugOrder,
  clearDrugOrdersStore,
  dispenseDrugSuccess,
  dispenseDrug,
  dispenseDrugFail,
  loadDrugOrders,
  loadDrugOrdersFail,
} from '../actions';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';
import { loadActiveVisit } from '../actions/visit.actions';

const reducer = createReducer(
  initialDrugsOrdersState,
  on(loadDrugOrders, loadActiveVisit, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(loadDrugOrdersFail, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  })),
  on(addDrugsOrdered, (state, { drugOrders }) =>
    drugOrderAdapter.addMany(drugOrders, { ...state, ...loadedBaseState })
  ),
  on(removeDrugOrder, (state, { orderId }) =>
    drugOrderAdapter.removeOne(orderId, { ...state })
  ),
  on(clearDrugOrdersStore, (state) => drugOrderAdapter.removeAll({ ...state })),
  // TODO: Find best way to handle additional attribute in drug order object
  on(dispenseDrug, (state, { drugOrder }) =>
    drugOrderAdapter.updateOne(
      {
        id: drugOrder.uuid,
        changes: { loading: true } as any,
      },
      state
    )
  ),
  on(dispenseDrugSuccess, (state, { drugOrder }) =>
    drugOrderAdapter.removeOne(drugOrder.uuid, state)
  ),
  on(dispenseDrugFail, (state, { drugOrder, error }) =>
    drugOrderAdapter.updateOne(
      { id: drugOrder.uuid, changes: { loading: false } as any },
      state
    )
  )
);

export function drugOrdersReducer(state, action) {
  return reducer(state, action);
}
