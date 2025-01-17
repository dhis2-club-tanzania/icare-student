import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VisitsState, visitsAdapter, LabSamplesState } from '../states';

import * as _ from 'lodash';
import { getPatientsByVisits, getVisitsByEncounterTypeWhereThereAreOrders } from 'src/app/shared/helpers/visits.helper';
import { getAllLabSamples } from './lab-samples.selectors';

const getVisitsState = createFeatureSelector<VisitsState>('visitsDetails');

export const getVisitsLoadedState = createSelector(
  getVisitsState,
  (state: VisitsState) => state.loaded
);

export const getVisitsDetailsLoadedState = createSelector(
  getVisitsState,
  (state: VisitsState) => state.loadedVisits
);

export const {
  selectAll: getAllVisits,
  selectEntities: getAllVisitsEntities,
} = visitsAdapter.getSelectors(getVisitsState);

export const getAllPatientsVisitsReferences = createSelector(
  getVisitsState,
  (state: VisitsState) => {
    return state.visitsReferences;
  }
);

export const getPatientOrderDetailsByPatientId = createSelector(
  getAllPatientsVisitsReferences,
  (patients, props) => {
    const patientInfo = (patients.filter(
      (patient) => patient.patient_id.toString() === props.id
    ) || [])[0];
    let patientData;
    if (patientInfo) {
      patientData = {
        ...patientInfo,
        id: patientInfo?.uuid,
        searchingText: patientInfo?.name + patientInfo?.identifier,
        orders: patientInfo['orderedItems'].map((orderedItem) => {
          return {
            ...patientInfo,
            searchingText: patientInfo?.name + patientInfo?.identifier,
            ...orderedItem,
            identifier: patientInfo?.identifier,
            collected: orderedItem.collected != '' ? true : false,
          };
        }),
        allOrdersCollected:
          patientInfo['orderedItems'].length ==
          (
            _.filter(patientInfo['orderedItems'], (order) => {
              if (order?.collected != '') {
                return order;
              }
            }) || []
          )?.length >
            0
            ? true
            : false,
      };
    }
    return patientInfo ? patientData?.orders : [];
  }
);

export const getPatientsVisitsReferences = createSelector(
  getVisitsState,
  (state: VisitsState, props) => {
    if (props['reCollection'] == false) {
      return (
        _.filter(state.visitsReferences, {
          allOrdersCollected: props?.allOrdersCollected,
        }) || []
      );
    } else {
      state.visitsReferences.filter((visit) => visit.reCollection);
      return (
        _.filter(state.visitsReferences, {
          allOrdersCollected: props?.allOrdersCollected,
          reCollection: props?.reCollection,
        }) || []
      );
    }
  }
);

export const getPatientsWithOrdersForRecollection = createSelector(
  getVisitsState,
  (state: VisitsState, props) => {
    return (
      _.filter(state.visitsReferences, {
        allOrdersCollected: props?.allOrdersCollected,
      }) || []
    );
  }
);

export const getCountOfActivePatients = createSelector(
  getVisitsState,
  (state: VisitsState) => {
    return state.visitsReferences?.length;
  }
);

export const getCountOfFullAttendedPatients = createSelector(
  getVisitsState,
  (state: VisitsState) => {
    return (
      _.filter(state.visitsReferences, {
        allOrdersCollected: true,
      }) || []
    )?.length;
  }
);

export const getCountOfPatientsAwaitingSampleCollection = createSelector(
  getVisitsState,
  (state: VisitsState) => {
    return (
      _.filter(state.visitsReferences, {
        allOrdersCollected: false,
      }) || []
    )?.length;
  }
);

export const getPatientsNotAttendedVisitsReferences = createSelector(
  getVisitsState,
  getAllLabSamples,
  (state: VisitsState, allLabSamples: any) => {
    let groupedLabSamples = _.groupBy(allLabSamples, 'mrNo');
    let groupedCollectedSamples = _.groupBy(
      _.filter(allLabSamples, (sample) => {
        return sample.collected ? true : false;
      }),
      'mrNo'
    );

    state = {
      ...state,
      visitsReferences: _.filter(state.visitsReferences, (visitRef) => {
        return groupedCollectedSamples[visitRef?.identifier]?.length ==
          groupedLabSamples[visitRef?.identifier]?.length
          ? false
          : true;
      }),
    };

    return state.visitsReferences;
  }
);

export const getPatientsAttendedVisitsReferences = createSelector(
  getVisitsState,
  getAllLabSamples,
  (state: VisitsState, allLabSamples: any) => {
    let groupedLabSamples = _.groupBy(allLabSamples, 'mrNo');
    let groupedCollectedSamples = _.groupBy(
      _.filter(allLabSamples, (sample) => {
        return sample.collected ? true : false;
      }),
      'mrNo'
    );

    state = {
      ...state,
      visitsReferences: _.filter(state.visitsReferences, (visitRef) => {
        return groupedCollectedSamples[visitRef?.identifier]?.length ==
          groupedLabSamples[visitRef?.identifier]?.length
          ? true
          : false;
      }),
    };

    return state.visitsReferences;
  }
);

export const getVisitsParameters = createSelector(
  getVisitsState,
  (state: VisitsState) => state.parameters
);

export const getAllConsultationVisits = createSelector(getAllVisits, (visits) =>
  _.uniqBy(
    getVisitsByEncounterTypeWhereThereAreOrders(visits, 'Consultation'),
    'uuid'
  )
);

export const getPatientVisitByVisitUuid = createSelector(
  getAllVisitsEntities,
  (entities, props) => entities[props?.id]
);

export const getAllPatientsWithActiveVisits = createSelector(
  getAllConsultationVisits,
  (visits) => getPatientsByVisits(visits)
);

export const getPatientVisitLoadedState = createSelector(
  getVisitsState,
  (state: VisitsState) => state.loadedVisits
);
