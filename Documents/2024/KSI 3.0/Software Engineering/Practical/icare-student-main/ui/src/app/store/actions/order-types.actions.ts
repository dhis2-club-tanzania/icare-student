import { createAction, props } from '@ngrx/store';
import {
  OrdertypeGetFull,
  OrdertypeGet
} from 'src/app/shared/resources/openmrs';
import { ErrorMessage } from 'src/app/shared/modules/openmrs-http-client/models/error-message.model';

export const loadOrderTypes = createAction('[Order types] load order types');

export const addLoadedOrderTypes = createAction(
  '[Order types] add loaded order types',
  props<{ orderTypes: OrdertypeGet[] }>()
);

export const loadingOrderTypesFail = createAction(
  '[Order types] loading order types fails',
  props<{ error: ErrorMessage }>()
);
