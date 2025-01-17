import { createReducer, on } from '@ngrx/store';
import { addLoadedRadiologyOrders, clearRadiologyOrders } from '../actions';
import { initialRadiologyOrdersState, radiologyOrdersAdapter } from '../states';
import { loadedBaseState } from '../states/base.state';

const reducer = createReducer(
  initialRadiologyOrdersState,
  on(addLoadedRadiologyOrders, (state, { orders }) =>
    radiologyOrdersAdapter.addMany(orders, { ...state, ...loadedBaseState })
  ),
  on(clearRadiologyOrders, (state) =>
    radiologyOrdersAdapter.removeAll({ ...state, ...loadedBaseState })
  )
);

export function radiologyOrdersReducer(state, action) {
  return reducer(state, action);
}
