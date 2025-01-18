import { createReducer, on } from '@ngrx/store';
import { initialSampleState, samplesAdapter } from '../states/samples.states';
import {
  createSample,
  upsertSample,
  upsertSamples,
  creatingSampleFails,
  requestSampleIdentifier,
  upsertSampleIdentifierDetails,
  setSampleStatus,
  addLabTestResults,
  setContainerForLabTest,
  signOffLabTestResult,
  updateSampleOnStore,
  allocateTechnicianToLabTest,
  loadAllLabSamples,
  upsertSamplesToCollect,
  loadSamplesByVisit,
  clearSamplesToCollect,
  clearSamples,
  markSampleCollected,
  removeCollectedSampleFromSamplesToCollect,
} from '../actions';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from 'src/app/store/states/base.state';

const reducer = createReducer(
  initialSampleState,
  on(createSample, (state) => ({
    ...state,
  })),
  on(loadSamplesByVisit, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(upsertSample, (state, { sample }) =>
    samplesAdapter.addOne(sample, { ...state, ...loadedBaseState })
  ),
  on(updateSampleOnStore, (state, { sample }) =>
    samplesAdapter.updateOne(sample, {
      ...state,
      savingApporoval: false,
      savingResults: false,
    })
  ),
  on(upsertSamples, (state, { samples }) =>
    samplesAdapter.addMany(samples, { ...state, ...loadedBaseState })
  ),
  on(clearSamples, (state) => samplesAdapter.removeAll({ ...state })),
  on(upsertSamplesToCollect, (state, { samplesToCollect }) => ({
    ...state,
    samplesToCollect,
    ...loadedBaseState,
  })),
  on(clearSamplesToCollect, (state) => ({
    ...state,
    samplesToCollect: [],
  })),
  on(markSampleCollected, (state, { sample }) => {
    return {
      ...state,
      samplesToCollect: [],
    };
  }),
  on(creatingSampleFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(loadAllLabSamples, (state) => ({
    ...loadingBaseState,
    ...state,
  })),
  on(requestSampleIdentifier, (state) => ({
    ...state,
  })),
  on(upsertSampleIdentifierDetails, (state, { sampleIdentifier }) => ({
    ...state,
    sampleIdentifiers: [...state.sampleIdentifiers, sampleIdentifier],
  })),
  on(setSampleStatus, (state) => ({
    ...state,
  })),
  on(addLabTestResults, (state) => ({
    ...state,
    savingResults: true,
  })),
  on(allocateTechnicianToLabTest, (state) => ({
    ...state,
  })),
  on(setContainerForLabTest, (state) => ({
    ...state,
  })),
  on(signOffLabTestResult, (state) => ({
    ...state,
    savingApporoval: true,
  })),
  on(removeCollectedSampleFromSamplesToCollect, (state, { referenceId }) => ({
    ...state,
    samplesToCollect: state.samplesToCollect.filter(
      (sampleToCollect) =>
        sampleToCollect?.departmentSpecimentSource !== referenceId
    ),
  }))
);

export function samplesReducer(state, action) {
  return reducer(state, action);
}
