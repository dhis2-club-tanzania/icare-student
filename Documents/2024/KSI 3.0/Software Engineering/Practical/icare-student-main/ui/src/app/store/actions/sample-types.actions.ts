import { createAction, props } from '@ngrx/store';

export const loadSampleTypesUuid = createAction(
  '[Sample types] load sample type UUID from global properties'
);

export const addLoadedSampleTypeUuid = createAction(
  '[Sample types] add sampletype uuid',
  props<{ id: string }>()
);

export const loadSampleTypes = createAction('[Sample types] load sample types');

export const addLoadedSampleTypes = createAction(
  '[Sample types] add loaded sample types',
  props<{ sampleTypes: any[] }>()
);

export const loadingSampleTypesFails = createAction(
  '[Sample types] loading sample types fails',
  props<{ error: any }>()
);

export const setLabConfigurations = createAction(
  '[Configurations] set configs',
  props<{ configs: any }>()
);

export const loadLabConfigurations = createAction(
  '[Configurations] load lab configs',
  props<{ periodParameters: any }>()
);
