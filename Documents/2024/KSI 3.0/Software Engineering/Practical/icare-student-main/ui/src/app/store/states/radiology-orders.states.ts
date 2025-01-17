import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { BaseState, initialBaseState } from './base.state';

export interface RadiologyOrdersState extends BaseState, EntityState<any> {}

export const radiologyOrdersAdapter: EntityAdapter<any> = createEntityAdapter<
  any
>();

export const initialRadiologyOrdersState = radiologyOrdersAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
