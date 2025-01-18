import { createReducer, on } from '@ngrx/store';
import { initialOrderTypesState, orderTypesAdapter } from '../states';
import {
  loadOrderTypes,
  addLoadedOrderTypes,
  loadingOrderTypesFail
} from '../actions';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState
} from '../states/base.state';

const reducer = createReducer(
  initialOrderTypesState,
  on(loadOrderTypes, state => ({
    ...state,
    ...loadingBaseState
  })),
  on(addLoadedOrderTypes, (state, { orderTypes }) =>
    orderTypesAdapter.addMany(orderTypes, { ...state, ...loadedBaseState })
  ),
  on(loadingOrderTypesFail, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState
  }))
);

export function orderTypesReducers(state, action) {
  return reducer(state, action);
}
