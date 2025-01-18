import { createAction, props } from "@ngrx/store";

export const loadLISConfigurations = createAction(
  "[LIS Configs] load LIS configs"
);

export const addLoadedLISConfigs = createAction(
  "[LIS Configs] add loaded LIS Configs",
  props<{ LISConfigs: any }>()
);

export const loadingLISConfigsFails = createAction(
  "[LIS Configs] loading LIS configs fails",
  props<{ error: any }>()
);
