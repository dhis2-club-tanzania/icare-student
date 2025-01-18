import { createSelector } from '@ngrx/store';
import { AppState, getRootState } from '../reducers';
import { patientAdapter, PatientState } from '../states';
import { getLabOrdersBillingInfo } from './lab-orders-billing-info.selector';
import { getAllSampleTypes } from './sample-types.selectors';

import * as _ from 'lodash';
import { getAllConsultationVisits, getAllVisits } from './visits.selectors';
import { getAllSamplesForActiveVisit } from './samples.selectors';
import { getPatientsCollectedSamples, getSamplesToCollect, groupLabOrdersBySampleType } from 'src/app/shared/helpers/patient.helper';

const getPatientState = createSelector(
  getRootState,
  (state: AppState) => state.patient
);

export const {
  selectEntities: getPatientsEntities,
  selectAll: getAllPatients,
} = patientAdapter.getSelectors(getPatientState);

export const getLoadedPatientById = createSelector(
  getPatientsEntities,
  getAllPatients,
  (entities, patients, props) => {
    // console.log(props)
    // console.log('patients', patients)
    // console.log(entities)
    return entities[props.id];
  }
);

// export const getSampledOrdersByPatientUuid = createSelector(
//   getAllPatients,
//   getAllSampleTypes,
//   getLabOrdersBillingInfo,
//   (patientsVisits, sampleTypes, labOrdersBillingInfo, props) =>
//     groupLabOrdersBySampleType(
//       props?.visitDetails,
//       sampleTypes,
//       labOrdersBillingInfo,
//       props?.uuid
//     )
// );

export const getCurrentPatientCollectedSamples = createSelector(
  getPatientState,
  (state: PatientState) => _.groupBy(state.samples, 'name')
);

export const getSamplesToCollectSelector = createSelector(
  getAllSampleTypes,
  getLabOrdersBillingInfo,
  getAllSamplesForActiveVisit,
  (sampleTypes, labOrdersBillingInfo, samples, props) => {
    const ordersGroupedBySamples = groupLabOrdersBySampleType(
      props?.visitDetails,
      sampleTypes,
      labOrdersBillingInfo,
      props?.uuid
    );

    let collectedOrders = [];
    let ordersNotCollectedGroupedBySpecimenType = [];
    _.map(ordersGroupedBySamples, (groupedOrders) => {
      let items = [];
      let ordersNotCollected = [];
      _.map(groupedOrders?.items, (order) => {
        if (order?.sampleCollection?.status == 'Collected') {
          items = [...items, order];
        } else if (order?.status == 'Paid') {
          ordersNotCollected = [...ordersNotCollected, order];
        } else {
        }
      });
      groupedOrders['items'] = items;
      collectedOrders =
        items.length > 0
          ? [
              ...collectedOrders,
              { ...groupedOrders, items: items, collected: true },
            ]
          : collectedOrders;

      ordersNotCollectedGroupedBySpecimenType =
        ordersNotCollected?.length > 0
          ? [
              ...ordersNotCollectedGroupedBySpecimenType,
              {
                ...groupedOrders,
                sampleUniquIdentification: null,
                previousSampleUniquIdentification:
                  groupedOrders?.sampleUniquIdentification,
                sampleCollectionEncounterUuid: null,
                prevoiusSampleCollectionEncounterUuid:
                  groupedOrders?.sampleCollectionEncounterUuid,
                orders: ordersNotCollected,
                collected: false,
              },
            ]
          : ordersNotCollectedGroupedBySpecimenType;
    });
    return _.filter(ordersNotCollectedGroupedBySpecimenType, (sample) => {
      if (sample?.orders?.length > 0) {
        return sample;
      }
    });
  }
);

export const getSamplesCollectedSelector = createSelector(
  getAllSampleTypes,
  getLabOrdersBillingInfo,
  getAllSamplesForActiveVisit,
  (sampleTypes, labOrdersBillingInfo, samples, props) => {
    const ordersGroupedBySamples = groupLabOrdersBySampleType(
      props?.visitDetails,
      sampleTypes,
      labOrdersBillingInfo,
      props?.uuid
    );
    let ordersCollectedGroupedBySpecimenType = [];
    _.map(ordersGroupedBySamples, (groupedOrders) => {
      let orders = [];
      _.map(groupedOrders?.items, (order) => {
        if (order?.sampleCollection?.status == 'Collected') {
          orders = [...orders, order];
        }
      });
      groupedOrders['orders'] = orders;

      ordersCollectedGroupedBySpecimenType =
        groupedOrders?.items?.length > 0
          ? [
              ...ordersCollectedGroupedBySpecimenType,
              {
                ...groupedOrders,
                collected: true,
                orders: orders,
              },
            ]
          : ordersCollectedGroupedBySpecimenType;
    });

    ordersCollectedGroupedBySpecimenType = [
      ...ordersCollectedGroupedBySpecimenType,
      ..._.filter(samples, { patientUuid: props?.uuid }),
    ];

    return _.filter(
      _.uniqBy(ordersCollectedGroupedBySpecimenType, 'id'),
      (sample) => {
        if (sample?.orders?.length > 0) {
          return sample;
        }
      }
    );
  }
);

export const getAllSamplesForActiveVisits = createSelector(
  getAllConsultationVisits,
  getAllSampleTypes,
  getLabOrdersBillingInfo,
  (patientsVisits, sampleTypes, labOrdersBillingInfo) => {
    return _.filter(
      getPatientsCollectedSamples(
        patientsVisits,
        sampleTypes,
        labOrdersBillingInfo
      )
    );
  }
);

export const getAllSamplesToCollect = createSelector(
  getAllConsultationVisits,
  getAllSampleTypes,
  (visits, sampleTypes) => getSamplesToCollect(visits, sampleTypes)
);

export const getLabSamplesToCollect = createSelector(
  getPatientState,
  (state: PatientState) => {
    return _.filter(state.samples, { collected: false }) || [];
  }
);

export const getLabSamplesCollected = createSelector(
  getPatientState,
  (state: PatientState) => {
    return _.filter(state.samples, { collected: true }) || [];
  }
);
