import { state } from "@angular/animations";
import { Action, createReducer, on } from "@ngrx/store";
import {
  activeVisitNotFound,
  clearActiveVisit,
  clearVisits,
  holdVisitState,
  loadActiveVisit,
  loadVisitFail,
  startVisit,
  updateVisit,
  upsertAdmittedPatientLocation,
  upsertVisit,
  upsertVisitDeathCheck,
} from "../actions/visit.actions";
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from "../states/base.state";
import {
  initialVisitState,
  visitAdapter,
  VisitState,
} from "../states/visit.state";

const reducer = createReducer(
  initialVisitState,
  on(loadActiveVisit, startVisit, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(upsertVisit, (state, { visit, activeVisitUuid }) =>
    visitAdapter.upsertOne(visit, {
      ...state,
      ...loadedBaseState,
      activeVisitUuid,
    })
  ),
  on(clearActiveVisit, (state) => ({
    ...state,
    activeVisitUuid: null,
  })),
  on(loadVisitFail, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  })),
  on(upsertVisitDeathCheck, (state, { markedAsDead }) => ({
    ...state,
    markedAsDead,
  })),
  on(clearVisits, (state) => visitAdapter.removeAll(state)),
  on(activeVisitNotFound, (state) => ({ ...state, ...loadedBaseState })),
  on(upsertAdmittedPatientLocation, (state, { locationVisitDetails }) => ({
    ...state,
    admittedPatientsVisitLocations: [
      ...state.admittedPatientsVisitLocations,
      locationVisitDetails,
    ],
    patientAdmittedVisitsAdded: true,
  })),
  on(updateVisit, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(holdVisitState, (state) => ({
    ...state,
  }))
);

export function visitReducer(state: VisitState, action: Action): VisitState {
  return reducer(state, action);
}
