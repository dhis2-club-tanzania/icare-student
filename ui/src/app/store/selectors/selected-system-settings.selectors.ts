import { createSelector } from "@ngrx/store";
import { getRootState, AppState } from "../reducers";
import { SelectedSystemSettingsState } from "../states";

const getSelectedSystemSettingsState = createSelector(
  getRootState,
  (state: AppState) => state.systemSettings
);

export const getLoadedSytemSettings = createSelector(
  getSelectedSystemSettingsState,
  (state: SelectedSystemSettingsState) => state.systemSettings
);

export const getLoadedSystemSettingsState = createSelector(
  getSelectedSystemSettingsState,
  (state: SelectedSystemSettingsState) => state?.loaded
);

export const getLoadedSystemSettingsByKey = (key) =>
  createSelector(
    getSelectedSystemSettingsState,
    (state: SelectedSystemSettingsState) =>
      (state.systemSettings?.filter((setting) => setting?.key === key) || [])[0]
  );
