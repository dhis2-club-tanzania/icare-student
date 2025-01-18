import { createAction, props } from "@ngrx/store";

export const loadSystemSettings = createAction(
  "[System Settings] load selected system settings",
  props<{ settingsKeyReferences: string[] }>()
);

export const addLoadedSystemSettings = createAction(
  "[System Settings] add loaded system settings",
  props<{ systemSettings: any[] }>()
);

export const loadingSystemSettingsFails = createAction(
  "[System Settings] loading system settings fails",
  props<{ error: any }>()
);
