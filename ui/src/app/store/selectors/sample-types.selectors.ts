import { createSelector } from '@ngrx/store';
import { AppState, getRootState,  } from '../reducers';
import { SampleTypesState, sampleTypesAdapter } from '../states';

const getSampleTypesState = createSelector(
  getRootState,
  (state: AppState) => state.sampleTypes
);

export const getSampleTypesLoadedState = createSelector(
  getSampleTypesState,
  (state: SampleTypesState) => state.loaded
);

export const getSampleTypeUuid = createSelector(
  getSampleTypesState,
  (state: SampleTypesState) => state.sampleTypeUuid
);

export const {
  selectAll: getAllSampleTypes,
  selectEntities: getSampleTypesEntities
} = sampleTypesAdapter.getSelectors(getSampleTypesState);

export const getLabConfigurations = createSelector(
  getSampleTypesState,
  (state: SampleTypesState) => state.configs
);
