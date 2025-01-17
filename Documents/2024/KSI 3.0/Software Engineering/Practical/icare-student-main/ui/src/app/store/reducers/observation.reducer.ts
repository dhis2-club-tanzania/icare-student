import { Action, createReducer, on } from '@ngrx/store';
import {
  clearObservations,
  upsertObservation,
  upsertObservations,
  saveObservations,
  saveObservationsFail,
  saveObservationsUsingEncounter,
} from '../actions/observation.actions';
import { loadedBaseState } from '../states/base.state';
import {
  initialObservationState,
  observationAdapter,
  ObservationState,
} from '../states/observation.state';

const reducer = createReducer(
  initialObservationState,
  on(upsertObservation, (state, { observation }) =>
    observationAdapter.upsertOne(observation, {
      ...state,
      ...loadedBaseState,
    })
  ),
  on(upsertObservations, (state, { observations }) =>
    observationAdapter.upsertMany(observations, {
      ...state,
      savingObservations: false,
    })
  ),
  on(saveObservationsUsingEncounter, (state) => ({
    ...state,
    savingObservations: true,
  })),
  on(clearObservations, (state) => observationAdapter.removeAll(state)),
  on(saveObservations, (state) => ({ ...state, savingObservations: true })),
  on(saveObservationsFail, (state) => ({ ...state, savingObservations: false }))
);

export function observationReducer(
  state: ObservationState,
  action: Action
): ObservationState {
  return reducer(state, action);
}
