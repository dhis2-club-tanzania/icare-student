import { createReducer, on } from '@ngrx/store';
import {
  loadActiveVisitsForSampleManagement,
  loadingActiveVisitsForSamplesFails,
  saveObservation,
  updateSample,
  upsertCollectedSamples,
  upsertSample,
} from '../actions';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';
import { initialSamplesState, samplesAdapter } from '../states/samples.states';

const reducer = createReducer(
  initialSamplesState,
  on(loadActiveVisitsForSampleManagement, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(upsertCollectedSamples, (state, { collectedSamples }) =>
    samplesAdapter.addMany(collectedSamples, { ...state, ...loadedBaseState })
  ),
  on(loadingActiveVisitsForSamplesFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(saveObservation, (state) => ({
    ...state,
  })),
  on(updateSample, (state, { sample }) =>
    samplesAdapter.updateOne({ id: sample?.id, changes: sample }, { ...state })
  ),
  on(upsertSample, (state, { sample }) =>
    samplesAdapter.addOne(sample, { ...state })
  )
);

export function samplesReducer(state, action) {
  return reducer(state, action);
}
