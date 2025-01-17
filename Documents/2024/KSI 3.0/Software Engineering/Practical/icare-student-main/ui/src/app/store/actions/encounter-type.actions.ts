import { createAction, createSelector, props } from '@ngrx/store';

export const initiateEncounterType = createAction(
  '[EncounterType] Initiate encounter type'
);

export const loadEncounterTypes = createAction(
  '[EncounterType] Load encounterTypes'
);

export const initiateEncounterTypeLoadingState = createAction(
  '[EncounterType] initiate encounterType loading state'
);

export const loadEncounterTypesFailed = createAction(
  '[EncounterType] Load encounterType failed',
  props<{ error: any }>()
);

export const upsertEncounterTypes = createAction(
  '[EncounterType] Upsert encounterTypes',
  props<{ encounterTypes: any[] }>()
);
