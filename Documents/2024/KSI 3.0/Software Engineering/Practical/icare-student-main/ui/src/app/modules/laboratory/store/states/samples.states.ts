import { BaseState, initialBaseState } from 'src/app/store/states/base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { SampleObject, SampleIdentifier } from '../../resources/models';

export interface SamplesState extends BaseState, EntityState<SampleObject> {
  sampleIdentifiers: SampleIdentifier[];
  samplesToCollect: SampleObject[];
  savingResults: boolean;
  savingApporoval: boolean;
}

export const samplesAdapter: EntityAdapter<SampleObject> = createEntityAdapter<
  SampleObject
>();

export const initialSampleState = samplesAdapter.getInitialState({
  ...initialBaseState,
  sampleIdentifiers: [],
  samplesToCollect: [],
  savingResults: false,
  savingApporoval: false,
});
