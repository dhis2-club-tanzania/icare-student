import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import { orderTypesAdapter } from '../states';

import { filter } from 'lodash';

export const getOrderTypesState = createSelector(
  getRootState,
  (state: AppState) => state.orderTypes
);

export const {
  selectAll: getAllOrderTypes,
  selectEntities: getOrderTypesEntities,
} = orderTypesAdapter.getSelectors(getOrderTypesState);

export const getOrderTypesByName = createSelector(
  getAllOrderTypes,
  (orderTypes, props) => (filter(orderTypes, { display: props.name }) || [])[0]
);
