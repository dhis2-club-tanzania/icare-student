import { createReducer, on } from "@ngrx/store";
import { initialSelectedSystemSettingsState } from "../states/selected-system-settings.states";
import {
  addLoadedSystemSettings,
  loadSystemSettings,
  loadingSystemSettingsFails,
} from "../actions";
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from "../states/base.state";

const reducer = createReducer(
  initialSelectedSystemSettingsState,
  on(loadSystemSettings, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedSystemSettings, (state, { systemSettings }) => ({
    ...state,
    ...loadedBaseState,
    systemSettings,
  })),
  on(loadingSystemSettingsFails, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  }))
);

export function systemSettingsReducer(state, action) {
  return reducer(state, action);
}
