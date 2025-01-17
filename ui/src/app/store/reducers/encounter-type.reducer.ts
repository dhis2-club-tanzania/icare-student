import { Action, createReducer, on } from "@ngrx/store";
import {
  loadEncounterTypes,
  upsertEncounterTypes,
} from "../actions/encounter-type.actions";
import { loadedBaseState, loadingBaseState } from "../states/base.state";
import {
  encounterTypeAdapter,
  EncounterTypeState,
  initialEncounterTypeState,
} from "../states/encounter-type.state";

const reducer = createReducer(
  initialEncounterTypeState,
  on(loadEncounterTypes, (state) => ({ ...state, ...loadingBaseState })),
  on(upsertEncounterTypes, (state, { encounterTypes }) =>
    encounterTypeAdapter.upsertMany(encounterTypes, {
      ...state,
      ...loadedBaseState,
    })
  )
);

export function encounterTypeReducer(
  state: EncounterTypeState,
  action: Action
): EncounterTypeState {
  return reducer(state, action);
}
