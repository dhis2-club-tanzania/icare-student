import { createAction, props } from '@ngrx/store';

export const loadFormPrivilegesConfigs = createAction(
  '[Form priviledges configs] load form privileges'
);

export const addLoadedFormPrivilegesConfigs = createAction(
  '[Form privileges configs] add loaded form priviledges configs',
  props<{ formPrivileges: any }>()
);

export const loadingFormPrivilegesHasError = createAction(
  '[Form privileges configs] loading configs has error',
  props<{ error: any }>()
);
