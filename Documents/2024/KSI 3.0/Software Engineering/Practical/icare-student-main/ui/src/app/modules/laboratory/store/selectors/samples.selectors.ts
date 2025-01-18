import {
  MemoizedSelector,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { SamplesState, samplesAdapter } from '../states/samples.states';

import * as _ from 'lodash';
import { SampleObject } from '../../resources/models';
import {
  formatLabSamples,
  groupSamplesBymRNo,
  getSamplesWithTestsHavingSpecificSignOff,
  getSamplesWithNoStatus,
  getLabSamplesWithNoStatus,
  getAllLabTestsForCurrentUser,
} from '../../resources/helpers';

const getSamplesState: MemoizedSelector<Object, SamplesState> =
  createFeatureSelector<SamplesState>('labSamples');

export const {
  selectEntities: getLabSampleEntities,
  selectAll: getAllLabSamples,
} = samplesAdapter.getSelectors(getSamplesState);

export const getSamplesToCollect = createSelector(
  getSamplesState,
  (state: SamplesState) => state.samplesToCollect
);

export const getLabSamplesLoadingState = createSelector(
  getSamplesState,
  (state: SamplesState) => state.loading
);

export const getLabResultsSavingState = createSelector(
  getSamplesState,
  (state: SamplesState) => state.savingResults
);

export const getLabResultsSavingApprovalState = createSelector(
  getSamplesState,
  (state: SamplesState) => state.savingApporoval
);

export const getCurrentPatientSampleIdentifiers = createSelector(
  getSamplesState,
  (state: SamplesState) =>
    _.mapValues(_.keyBy(state.sampleIdentifiers, 'specimenSourceUuid'), 'id')
);

export const getLabSampleById = createSelector(
  getLabSampleEntities,
  (entities, props) => entities[props.id] || []
);

export const getLabSamplesGroupedBymrNo = createSelector(
  getAllLabSamples,
  (samples: SampleObject[]) => groupSamplesBymRNo(formatLabSamples(samples))
);

export const getLabSamplesGroupedBymrNoWithNoStatus = createSelector(
  getAllLabSamples,
  (samples: SampleObject[]) => {
    return groupSamplesBymRNo(getLabSamplesWithNoStatus(samples));
  }
);

export const getLabSamplesGroupedBymrNoAndFilteredByStatus = createSelector(
  getAllLabSamples,
  (samples: SampleObject[], props) => {
    return groupSamplesBymRNo(formatLabSamples(samples, props.status));
  }
);

export const getAllLabTestsAssignedOrActedByToCurrentUser = createSelector(
  getAllLabSamples,
  (samples, props) => getAllLabTestsForCurrentUser(samples, props?.user)
);

export const getTestOrdersAssignedToATechnicianGroupedBySample = createSelector(
  getAllLabSamples,
  (samples: SampleObject[]) => samples
);

export const getLabSamplesFilteredByStatus = createSelector(
  getAllLabSamples,
  (samples: SampleObject[], props) => {
    return formatLabSamples(samples, props.status);
  }
);

/**TODO: change these selectors for sign offs */
export const getLabSampleWithLabTestsHavingFirstSignOff = createSelector(
  getAllLabSamples,
  (samples: SampleObject[], props) => {
    return (_.filter(
      getSamplesWithTestsHavingSpecificSignOff(samples, 'FIRST'),
      {
        id: props.id,
      }
    ) || [])[0];
  }
);

export const getLabSampleWithLabTestsHavingSecondSignOff = createSelector(
  getAllLabSamples,
  (samples: SampleObject[], props) => {
    return (_.filter(
      getSamplesWithTestsHavingSpecificSignOff(samples, 'SECOND'),
      {
        id: props.id,
      }
    ) || [])[0];
  }
);

export const getTestOrderDetails = createSelector(
  getAllLabSamples,
  (samples: any[], props) => {
    const matchedSample = (_.filter(samples, { id: props?.sampleId }) || [])[0];
    return (_.filter(matchedSample?.orders, { uuid: props?.orderUuid }) ||
      [])[0];
  }
);
