import { createAction, createSelector, props } from "@ngrx/store";
import { FormConfig } from "src/app/shared/modules/form/models/form-config.model";

export const loadForms = createAction(
  "[Form] Load forms",
  props<{ formConfigs: FormConfig[] }>()
);

export const loadCustomOpenMRSForm = createAction(
  "[OpenMRS form] load custom openMRS form",
  props<{ formUuid: string; causesOfDeathConcepts?: string[] }>()
);

export const loadCustomOpenMRSForms = createAction(
  "[OpenMRS form] load custom openMRS forms",
  props<{ formUuids: string[]; causesOfDeathConcepts?: string[] }>()
);

export const initiateFormLoadingState = createAction(
  "[Form] initiate form loading state"
);

export const loadFormsFailed = createAction(
  "[Form] Load form failed",
  props<{ error: any }>()
);

export const upsertForms = createAction(
  "[Form] Upsert forms",
  props<{ forms: any[] }>()
);
