import { createAction, props } from '@ngrx/store';

export const addLoadedRadiologyOrders = createAction(
  '[Radiology orders] add loaded radiology orders',
  props<{ orders: any[] }>()
);

export const clearRadiologyOrders = createAction(
  '[Radiology orders] clear radiology orders'
);
