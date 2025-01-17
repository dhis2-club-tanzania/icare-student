import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import { radiologyOrdersAdapter } from '../states';

import { filter } from 'lodash';

export const getRadiologyOrdersState = createSelector(
  getRootState,
  (state: AppState) => state.radiologyOrders
);

export const {
  selectAll: getAllRadiologyOrders,
  selectEntities: getRadiologyOrdersEntities,
} = radiologyOrdersAdapter.getSelectors(getRadiologyOrdersState);

/**
 * TODO: consider difference way of handling orders
 */

export const getOrdersByOrderType = createSelector(
  getAllRadiologyOrders,
  (orders, props) => filter(orders, { orderType: props?.orderType })
);
