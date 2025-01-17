import { Action, createReducer, on } from '@ngrx/store';
import {
  initiateFormLoadingState,
  loadCustomOpenMRSForm,
  upsertForms,
} from '../actions';
import { loadedBaseState, loadingBaseState } from '../states/base.state';
import { formAdapter, FormState, initialFormState } from '../states/form.state';

const reducer = createReducer(
  initialFormState,
  on(initiateFormLoadingState, (state) => ({ ...state, ...loadingBaseState })),
  on(upsertForms, (state, { forms }) =>
    formAdapter.upsertMany(forms, { ...state, ...loadedBaseState })
  ),
  on(loadCustomOpenMRSForm, (state) => ({
    ...state,
    ...loadingBaseState,
  }))
);

export function formReducer(state: FormState, action: Action): FormState {
  return reducer(state, action);
}
