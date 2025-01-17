import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { DrugOrder } from 'src/app/shared/resources/order/models/drug-order.model';
import { BaseState, initialBaseState } from './base.state';

export interface DrugOrdersState extends EntityState<any>, BaseState {
  drugOrdeEncounterUuid: string;
}

export const drugOrderAdapter: EntityAdapter<DrugOrder> = createEntityAdapter<
  DrugOrder
>();

export const initialDrugsOrdersState = drugOrderAdapter.getInitialState({
  drugOrdeEncounterUuid: undefined,
  ...initialBaseState,
});
