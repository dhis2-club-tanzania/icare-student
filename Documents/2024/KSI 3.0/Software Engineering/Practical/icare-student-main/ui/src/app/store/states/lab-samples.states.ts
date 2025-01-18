import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { BaseState, initialBaseState } from './base.state';

export interface LabSamplesState extends BaseState, EntityState<any> {
  collectingSample: boolean;
  collectedSample: boolean;
  settingLabSampleStatus: boolean;
  setSampleStatus: boolean;
  savingResults: boolean;
  savedResults: boolean;
  savingStatus: boolean;
  savedStatus: boolean;
  markingReCollect: boolean;
  markedAsReCollect: boolean;
  sampleIdentifiers: Array<any>;
}

export interface NewLabSamplesState extends BaseState, EntityState<any> {}

export const newLabSamplesAdapter: EntityAdapter<any> = createEntityAdapter<
  any
>();

export const newInitialLabSampleState = newLabSamplesAdapter.getInitialState({
  ...initialBaseState,
  collectingSample: false,
  collectedSample: false,
  settingLabSampleStatus: false,
  setSampleStatus: false,
  savingResults: false,
  savedResults: false,
  savingStatus: false,
  savedStatus: false,
  markingReCollect: false,
  markedAsReCollect: false,
  sampleIdentifiers: [],
});

export const labSamplesAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialLabSamplesState = labSamplesAdapter.getInitialState({
  ...initialBaseState,
  collectingSample: false,
  collectedSample: false,
  settingLabSampleStatus: false,
  setSampleStatus: false,
  savingResults: false,
  savedResults: false,
  savingStatus: false,
  savedStatus: false,
  markingReCollect: false,
  markedAsReCollect: false,
  sampleIdentifiers: [],
});
