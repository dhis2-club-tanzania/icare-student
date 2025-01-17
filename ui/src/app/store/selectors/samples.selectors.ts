import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import { samplesAdapter, SamplesState } from '../states/samples.states';

import * as _ from 'lodash';
import { getAllVisits } from './visits.selectors';
import { getAllSampleTypes } from './sample-types.selectors';
import { groupAllActiveVisitsLabOrdersBySampleTypes } from 'src/app/shared/helpers/patient.helper';

const getSamplesState = createSelector(
  getRootState,
  (state: AppState) => state.samples
);

export const getSamplesLoadedState = createSelector(
  getSamplesState,
  (state: SamplesState) => state.loaded
);

export const getSamplesLoadingState = createSelector(
  getSamplesState,
  (state: SamplesState) => state.loading
);

export const {
  selectEntities: getSampleEntities,
  selectAll: getAllSamplesForActiveVisit,
} = samplesAdapter.getSelectors(getSamplesState);

export const getAllActivePatientsSamples = createSelector(
  getAllVisits,
  getAllSampleTypes,
  (visits, sampleTypes) => {
    const data = groupAllActiveVisitsLabOrdersBySampleTypes(
      visits,
      sampleTypes,
      null
    );
    return data;
  }
);

// export const getAllCollectedSamples = createSelector(
//   getAllSamplesForActiveVisit,
//   (samples: any) => _.uniqBy(_.filter(samples, { collected: true }) || [], 'id')
// );

export const getAllSamplesWaitingForAcceptance = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) =>
    _.filter(
      _.filter(samples, { accepted: false, rejected: false }),
      (sample) => {
        if (
          sample?.sampleUniquIdentification &&
          sample?.sampleUniquIdentification?.length > 0
        ) {
          return sample;
        }
      }
    )
);

export const getAllSamplesWaitingForAcceptanceGroupedBymrNo = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) => {
    const filteredSamples = _.filter(
      _.filter(samples, { accepted: false, rejected: false }),
      (sample) => {
        if (
          sample?.sampleUniquIdentification &&
          sample?.sampleUniquIdentification?.length > 0
        ) {
          return sample;
        }
      }
    );
    return _.map(Object.keys(_.groupBy(filteredSamples, 'mrNo')), (key) => {
      return {
        mrNo: key,
        samples: _.groupBy(filteredSamples, 'mrNo')[key],
      };
    });
  }
);

export const getAllAcceptedSamples = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) =>
    _.filter(samples, (sample) => {
      if (sample?.accepted && !sample?.rejected && sample?.id) {
        return sample;
      }
    }) || []
);

export const getAllRejectedSamples = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) => _.filter(samples, { collected: true, rejected: true })
);

export const getAllSamples = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) => _.filter(samples, { collected: true, rejected: true })
);

export const getSamplesWaitingToFeedResults = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) =>
    _.filter(samples, {
      collected: true,
      accepted: true,
      rejected: false,
      fullCompleted: false,
    })
);

export const getSamplesFullyCompleted = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) =>
    _.filter(samples, {
      fullCompleted: true,
    })
);

export const getTechnicianWorkList = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any, props) => {
    let worklist = [];
    _.each(
      _.orderBy(
        _.filter(samples, {
          accepted: true,
          rejected: false,
          collected: true,
        }),
        ['visitStartDatetime', 'mrNo'],
        ['asc', 'asc']
      ) || [],
      (sample) => {
        worklist =
          (
            _.filter(sample?.orders, (order) => {
              if (
                (
                  _.filter(order?.acceptRejectProviders, (provider) => {
                    if (provider?.provider?.uuid == props?.providerUuid) {
                      return provider;
                    }
                  }) || []
                )?.length > 0
              ) {
                return order;
              }
            }) || []
          )?.length > 0
            ? [...worklist, ...sample?.orders]
            : worklist;
      }
    );
    // console.log('worklist', worklist);

    // console.log('provider uuid', props?.providerUuid);
    return worklist;
  }
);

export const getSamplesWaitingToAcceptance = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) =>
    _.filter(samples, {
      collected: true,
      accepted: false,
      rejected: false,
    })
);

export const getSamplesWithResults = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) =>
    _.filter(samples, {
      fullCompleted: true,
    })
);

export const getSamplesWithResultsGroupedByMRN = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any) =>
    _.groupBy(
      _.filter(samples, {
        allHaveResults: true,
        accepted: true,
        rejected: false,
      }),
      'mrNo'
    )
);

export const getSampleOrdersBySampleId = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any[], props) =>
    _.uniqBy((_.filter(samples, { id: props?.id }) || [])[0]?.orders, 'display')
);

export const getLabSampleById = createSelector(
  getAllSamplesForActiveVisit,
  (samples: any[], props) => (_.filter(samples, { id: props?.id }) || [])[0]
);
