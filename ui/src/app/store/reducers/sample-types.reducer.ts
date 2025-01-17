import { createReducer, on } from '@ngrx/store';
import { initialSampleTypesState, sampleTypesAdapter } from '../states';
import {
  loadSampleTypes,
  addLoadedSampleTypes,
  loadingSampleTypesFails,
  loadSampleTypesUuid,
  addLoadedSampleTypeUuid,
  setLabConfigurations
} from '../actions';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState
} from '../states/base.state';

const reducer = createReducer(
  initialSampleTypesState,
  on(loadSampleTypesUuid, state => ({
    ...state,
    ...loadingBaseState
  })),

  on(addLoadedSampleTypeUuid, (state, { id }) => ({
    ...state,
    ...loadedBaseState,
    sampleTypeUuid: id
  })),
  on(loadSampleTypes, state => ({
    ...state,
    ...loadingBaseState
  })),
  on(addLoadedSampleTypes, (state, { sampleTypes }) =>
    sampleTypesAdapter.addMany(sampleTypes, { ...state, ...loadedBaseState })
  ),
  on(loadingSampleTypesFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState
  })),
  on(setLabConfigurations, (state, { configs }) => ({
    ...state,
    configs
  }))
);

export function sampleTypesReducer(state, action) {
  return reducer(state, action);
}
