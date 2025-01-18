import { createReducer, on } from "@ngrx/store";
import { initialVisitsState, visitsAdapter } from "../states";
import {
  loadActiveVisits,
  addLoadedVisitsDetails,
  loadingLabOrderBillingInfoFails,
  setVisitsParameters,
  loadActiveVisitsForSampleManagement,
  upsertCollectedSamples,
  loadActiveVisitsWithLabOrders,
  addLoadedActiveVisitsWithLabOrders,
  loadingActiveVisitsWithLabOrdersFails,
  loadPatientsVisitDetailsByVisitUuids,
  addPatientVisitsDetails,
  clearVisitsDatesParameters,
} from "../actions";
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState,
} from "../states/base.state";

const reducer = createReducer(
  initialVisitsState,
  on(loadActiveVisits, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedVisitsDetails, (state, { visits }) =>
    visitsAdapter.addMany(visits, { ...state, ...loadedBaseState })
  ),
  on(loadingLabOrderBillingInfoFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
    ...loadedBaseState,
  })),
  on(clearVisitsDatesParameters, (state) => ({
    ...state,
    parameters: null,
  })),
  on(setVisitsParameters, (state, { parameters }) => ({
    ...state,
    parameters,
  })),
  on(loadActiveVisitsWithLabOrders, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedActiveVisitsWithLabOrders, (state, { activeVisits }) => ({
    ...state,
    visitsReferences: activeVisits,
    ...loadedBaseState,
  })),
  on(loadingActiveVisitsWithLabOrdersFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(loadPatientsVisitDetailsByVisitUuids, (state) => ({
    ...state,
    loadingVisits: true,
    loadedVisits: false,
    loadingVisitsHasError: false,
    loadingVisitsError: null,
  })),
  on(addPatientVisitsDetails, (state, { visits }) =>
    visitsAdapter.addMany(visits, {
      ...state,
      loadingVisits: false,
      loadedVisits: true,
      loadingVisitsHasError: false,
      loadingVisitsError: null,
    })
  )
);

export function visitsReducer(state, action) {
  return reducer(state, action);
}
