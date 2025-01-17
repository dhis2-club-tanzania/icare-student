import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from "@ngrx/store";
import { AppState, getRootState } from "../reducers";
import { LISConfigsState } from "../states/lis-configurations.states";

const getLISConfigsState = createSelector(
  getRootState,
  (state: AppState) => state.lisConfigs
);

export const getLISConfigurationsLoadedState = createSelector(
  getLISConfigsState,
  (state: LISConfigsState) => state.loaded
);

export const getLISConfigurationsLoadingError = createSelector(
  getLISConfigsState,
  (state: LISConfigsState) => state.error
);

export const getLISConfigurations = createSelector(
  getLISConfigsState,
  (state: LISConfigsState) => state.LISConfigs
);
