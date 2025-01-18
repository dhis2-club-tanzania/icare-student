import { createSelector } from '@ngrx/store';
import { AppState, getRootState } from '../reducers';
import { FormPrivilegesConfigsState } from '../states/form-privileges-configs.state';

const getFormPrivilegesConfigsState = createSelector(
  getRootState,
  (state: AppState) => state.formPrivileges
);

export const getFormPrivilegesConfigsLoadingState = createSelector(
  getFormPrivilegesConfigsState,
  (state: FormPrivilegesConfigsState) => state.loading
);

export const getFormPrivilegesConfigs = createSelector(
  getFormPrivilegesConfigsState,
  (state: FormPrivilegesConfigsState) => state.formPrivileges
);
