import { BaseState, initialBaseState } from './base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface SamplesState extends BaseState, EntityState<any> {}

export const samplesAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialSamplesState = samplesAdapter.getInitialState({
  ...initialBaseState,
});
