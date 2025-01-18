import { createReducer, on } from "@ngrx/store";
import {
  addFormattedLabSamples,
  addLoadedSample,
  addLoadedSampleRejectionCodedReasons,
  addReloadedLabSamples,
  clearLabSample,
  clearLoadedLabSamples,
  collectSample,
  loadLabSamplesByCollectionDates,
  loadSampleByUuid,
  loadSampleRejectionCodedReasons,
  markSampleAsToRecollect,
  saveLabTestResults,
  saveLabTestResultsStatus,
  saveTestsContainerAllocation,
  setLoadedSamples,
  setSampleStatus,
  setSampleStatuses,
  updateLabSample,
  updateLabSamples,
  updateSample,
} from "../actions";
import {
  initialLabSamplesState,
  labSamplesAdapter,
  newLabSamplesAdapter,
} from "../states";
import { loadedBaseState, loadingBaseState } from "../states/base.state";

import * as _ from "lodash";

const newReducer = createReducer(
  initialLabSamplesState,
  on(loadLabSamplesByCollectionDates, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addFormattedLabSamples, (state, { samples }) => {
    return newLabSamplesAdapter.addMany(samples, {
      ...state,
      ...loadedBaseState,
    });
  }),
  on(loadSampleByUuid, (state) => {
    return { ...state };
  }),
  on(clearLabSample, (state, { label }) => {
    return newLabSamplesAdapter.removeOne(label, state);
  }),
  on(addLoadedSample, (state, { sample }) => {
    const matchedSample = state?.entities[sample?.id];
    return !matchedSample
      ? newLabSamplesAdapter.addOne(sample, {
          ...state,
          ...loadedBaseState,
        })
      : newLabSamplesAdapter.updateOne(
          { id: sample?.id, changes: sample },
          {
            ...state,
            collectingSample: false,
            collectedSample: true,
            settingLabSampleStatus: false,
            setSampleStatus: true,
            savingResults: false,
            savedResults: true,
            savingStatus: false,
            savedStatus: true,
            markingReCollect: false,
            markedAsReCollect: true,
          }
        );
  }),
  on(updateLabSample, (state, { sample }) =>
    newLabSamplesAdapter.updateOne(
      { id: sample?.id, changes: sample },
      {
        ...state,
        collectingSample: false,
        collectedSample: true,
        settingLabSampleStatus: false,
        setSampleStatus: true,
        savingResults: false,
        savedResults: true,
        savingStatus: false,
        savedStatus: true,
        markingReCollect: false,
        markedAsReCollect: true,
      }
    )
  ),
  on(saveTestsContainerAllocation, (state) => ({
    ...state,
    settingLabSampleStatus: true,
    setSampleStatus: false,
  })),
  on(updateLabSamples, (state, { samples }) =>
    newLabSamplesAdapter.updateMany(samples, {
      ...state,
      collectingSample: false,
      collectedSample: true,
      settingLabSampleStatus: false,
      setSampleStatus: true,
      savingResults: false,
      savedResults: true,
      savingStatus: false,
      savedStatus: true,
    })
  ),
  on(setSampleStatus, (state) => ({
    ...state,
    settingLabSampleStatus: true,
    setSampleStatus: false,
  })),
  on(setSampleStatuses, (state) => ({
    ...state,
    settingLabSampleStatus: true,
    setSampleStatus: false,
  })),
  on(saveLabTestResults, (state) => ({
    ...state,
    savingResults: true,
    savedResults: false,
  })),
  on(saveLabTestResultsStatus, (state) => ({
    ...state,
    savingStatus: true,
    savedStatus: false,
  })),
  on(clearLoadedLabSamples, (state) =>
    newLabSamplesAdapter.removeAll({
      ...state,
    })
  )
);

const reducer = createReducer(
  initialLabSamplesState,
  on(setLoadedSamples, (state, { labSamples }) => {
    let samples = [];
    _.map(labSamples, (sampleByPatient) => {
      samples = [...samples, ...sampleByPatient?.groupedOrders];
    });
    return labSamplesAdapter.addMany(samples, {
      ...state,
    });
  }),
  on(collectSample, (state) => ({
    ...state,
    collectingSample: true,
    collectedSample: false,
  })),
  on(addReloadedLabSamples, (state, { newSamples }) => {
    let samples = [];
    _.map(newSamples, (sampleByPatient) => {
      samples = [...samples, ...sampleByPatient?.groupedOrders];
    });
    return labSamplesAdapter.upsertMany(samples, {
      ...state,
    });
  }),
  on(loadSampleRejectionCodedReasons, (state) => {
    return state;
  })
);

export function labSamplesReducer(state, action) {
  return reducer(state, action);
}

export function newLabSamplesReducer(state, action) {
  return newReducer(state, action);
}
