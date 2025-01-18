import { createReducer, on } from '@ngrx/store';
import {
  addLoadedFormPrivilegesConfigs,
  loadFormPrivilegesConfigs,
  loadingFormPrivilegesHasError,
} from '../actions/form-privileges-configs.actions';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';
import { initialFormPrivilegesState } from '../states/form-privileges-configs.state';

const reducer = createReducer(
  initialFormPrivilegesState,
  on(loadFormPrivilegesConfigs, (state) => ({
    ...loadingBaseState,
    ...state,
  })),
  on(addLoadedFormPrivilegesConfigs, (state, { formPrivileges }) => ({
    ...state,
    ...loadedBaseState,
    formPrivileges,
  })),
  on(loadingFormPrivilegesHasError, (state, { error }) => ({
    ...errorBaseState,
    error,
    ...state,
  }))
);

export function formPrivilegesReducer(state, action) {
  return reducer(state, action);
}
