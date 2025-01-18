import { BaseState, initialBaseState } from './base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface SampleTypesState extends BaseState, EntityState<any> {
  sampleTypeUuid: string;
  configs: any;
}

export const sampleTypesAdapter: EntityAdapter<any> = createEntityAdapter<
  any
>();

export const initialSampleTypesState = sampleTypesAdapter.getInitialState({
  sampleTypeUuid: null,
  ...initialBaseState,
  configs: null
});
