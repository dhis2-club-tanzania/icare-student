import { BaseState, initialBaseState } from './base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { OrdertypeGet } from 'src/app/shared/resources/openmrs';

export interface OrderTypesState extends BaseState, EntityState<OrdertypeGet> {}

export const orderTypesAdapter: EntityAdapter<OrdertypeGet> = createEntityAdapter<
  OrdertypeGet
>();

export const initialOrderTypesState = orderTypesAdapter.getInitialState({
  ...initialBaseState
});
