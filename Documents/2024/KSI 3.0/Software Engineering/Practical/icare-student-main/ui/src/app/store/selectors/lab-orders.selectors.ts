import { createSelector } from "@ngrx/store";
import { getRootState, AppState } from "../reducers";
import { labOrderAdapter, LabOrdersState } from "../states";

import * as _ from "lodash";

const getLabOrdersState = createSelector(
  getRootState,
  (state: AppState) => state.labOrders
);

export const {
  selectAll: getAllLabOrders,
  selectEntities: getLabOrdersEntities,
} = labOrderAdapter.getSelectors(getLabOrdersState);

export const getAllNewLabOrders = createSelector(
  getAllLabOrders,
  (labOrders: any) => {
    return labOrders.filter((labOrder) => labOrder?.action === "NEW");
  }
);

export const getCreatingLabOrderState = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.creatingLabOrder
);

export const getCreatingLabOrderError = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.creatingLabOrderError
);

export const getCreatingLabOrderFailsState = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.creatingLabOrderFails
);

export const getLabOrdersKeyedByConceptUuid = createSelector(
  getAllLabOrders,
  (labOrders) => {
    const keyedByConceptOrders = {};
    _.each(labOrders, (order) => {
      keyedByConceptOrders[order?.concept?.uuid] = order;
    });
    return keyedByConceptOrders;
  }
);

export const getFailedLabOrders = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => {
    const keyedByConceptOrders = {};
    _.each(state.failedOrders, (order) => {
      keyedByConceptOrders[order?.concept] = order;
    });
    return keyedByConceptOrders;
  }
);

export const getLabTestsContainers = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.testContainers
);

export const getLabSampleContainers = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.sampleContainers
);

export const getCodedSampleRejectionReassons = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.codedSampleRejectionReasons
);

export const getLabDepartments = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => {
    return state.labDepartments;
  }
);

export const getLabOrderVoidingState = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.voidingOrder
);

export const getLabOrdersWithFirstSignOff = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.labOrdersWithFirstSignOff
);

export const getLabOrdersWithSecondSignOff = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.labOrdersWithSecondSignOff
);

export const getAcceptedLabOrders = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.acceptedLabOrders
);

export const getRejectedLabOrders = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.rejectedLabOrders
);

export const getSampleIdentifierDetails = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.sampleIdentifierDetails
);

export const getLabOrdersWithIntermediateResults = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.labOrdersWithIntermediateResults
);

export const getLabOrdersLoadedState = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.loaded
);

export const getCollectedLabOrders = createSelector(
  getLabOrdersState,
  (state: LabOrdersState) => state.collectedLabOrders
);
