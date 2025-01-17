import { createReducer, on } from "@ngrx/store";
import {
  loadedBaseState,
  loadingBaseState,
} from "src/app/store/states/base.state";
import {
  addLoadedLISConfigs,
  loadingLISConfigsFails,
  loadLISConfigurations,
} from "../actions";
import { initialLISConfigsState } from "../states/lis-configurations.states";

const reducer = createReducer(
  initialLISConfigsState,
  on(loadLISConfigurations, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedLISConfigs, (state, { LISConfigs }) => ({
    ...state,
    LISConfigs,
    ...loadedBaseState,
  })),
  on(loadingLISConfigsFails, (state, { error }) => ({
    ...state,
    error,
    ...loadedBaseState,
    hasError: true,
  }))
);

export function LISConfigsReducer(state, action) {
  return reducer(state, action);
}
