import { createSelector } from "@ngrx/store";
import { AppState, getRootState } from "../reducers";
import { visitAdapter, VisitState } from "../states";

import { mapValues, keyBy } from "lodash";

const getVisitState = createSelector(
  getRootState,
  (state: AppState) => state.visit
);

const { selectAll: getAllVisits, selectEntities: getVisitEntities } =
  visitAdapter.getSelectors(getVisitState);

export const getVisitLoadingState = createSelector(
  getVisitState,
  (visitState: VisitState) => visitState.loading
);

export const getVisitLoadedState = createSelector(
  getVisitState,
  (visitState: VisitState) => visitState.loaded
);

export const getActiveVisitUuid = createSelector(
  getVisitState,
  (visitState: VisitState) => visitState.activeVisitUuid
);

export const getVisitError = createSelector(
  getVisitState,
  (visitState: VisitState) => visitState.error
);

export const getVisitErrorState = createSelector(
  getVisitState,
  (visitState: VisitState) => visitState.hasError
);

export const getActiveVisit = createSelector(
  getVisitEntities,
  getActiveVisitUuid,
  (visitEntities: any, visitUuid: string) =>
    visitEntities ? visitEntities[visitUuid] : null
);

export const getActiveVisitAuthorizationNumberAttribute = createSelector(
  getVisitEntities,
  getActiveVisitUuid,
  (visitEntities: any, visitUuid: string) =>
    visitEntities && visitEntities[visitUuid]
      ? (visitEntities[visitUuid].attributes.filter(
          (attribute) =>
            attribute?.visitAttributeDetails?.attributeType?.uuid ===
            "INSURANCEAUTHNOIIIIIIIIIIIIIIIIATYPE"
        ) || [])[0]
      : null
);

export const getAllAdmittedPatientVisits = createSelector(
  getVisitState,
  (state: VisitState) => {
    return state.admittedPatientsVisitLocations &&
      state.admittedPatientsVisitLocations?.length > 0
      ? mapValues(keyBy(state.admittedPatientsVisitLocations, "id"))
      : { data: "NO" };
  }
);

export const getActiveVisitDeathStatus = createSelector(
  getVisitState,
  (state: VisitState) => state.markedAsDead
);

export const getCurrentVisitServiceAttributeDetails = createSelector(
  getActiveVisit,
  getVisitEntities,
  (activeVisit, visitEntities) => {
    // TODO: Remove hard coded uuid for visit attribute type uuid (service) uuid
    if (activeVisit && visitEntities) {
      return (visitEntities[activeVisit?.id]?.attributes.filter(
        (visitAttribute: any) =>
          visitAttribute.visitAttributeDetails?.attributeType?.uuid ===
          "66f3825d-1915-4278-8e5d-b045de8a5db9"
      ) || [])[0];
    } else {
      return null;
    }
  }
);

export const getCurrentVisitServiceBillingAttributeDetails = createSelector(
  getActiveVisit,
  getVisitEntities,
  (activeVisit, visitEntities) => {
    // TODO: Remove hard coded uuid for visit attribute type uuid (service billing concept) uuid
    if (activeVisit && visitEntities) {
      return (visitEntities[activeVisit?.id]?.attributes.filter(
        (visitAttribute: any) =>
          visitAttribute.visitAttributeDetails?.attributeType?.uuid ===
          "SERVICE0IIIIIIIIIIIIIIIIIIIIIIIATYPE"
      ) || [])[0];
    } else {
      return null;
    }
  }
);

export const getPatientVisitsForAdmissionAddedState = createSelector(
  getVisitState,
  (visit: VisitState) => visit?.patientAdmittedVisitsAdded
);

export const getIsPatientSentForExemption = (orderTypeUuid: string) => createSelector(
  getActiveVisit,
  (activeVisit) => {
    if (activeVisit) {
      let encountersWithExemptionOrderActive = activeVisit.encounters.filter((encounter) => {
        //TODO: to be worked on making sure fulfiller status is one of the order properties in an encounter orders list
        let orders =  encounter.orders.filter((order) => {
          if(order.orderType.uuid === orderTypeUuid){
            return order
          }
        })
        if(orders.length > 0){
          return encounter;
        }
      })
      return encountersWithExemptionOrderActive.length > 0 ? true : false;
    } else {
      return false;
    }
  }
);
