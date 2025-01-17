import { Action, createReducer, on } from '@ngrx/store';
import {
  clearDiagnosis,
  upsertDiagnosis,
  upsertDiagnoses,
  saveDiagnosis,
  updateDiagnosis,
  deleteDiagnosis,
  removeDiagnosis,
} from '../actions/diagnosis.actions';
import { loadedBaseState, loadingBaseState } from '../states/base.state';
import {
  initialDiagnosisState,
  diagnosisAdapter,
  DiagnosisState,
} from '../states/diagnosis.state';

const reducer = createReducer(
  initialDiagnosisState,
  on(upsertDiagnosis, (state, { diagnosis }) =>
    diagnosisAdapter.upsertOne(diagnosis, {
      ...state,
      ...loadedBaseState,
    })
  ),
  on(upsertDiagnoses, (state, { diagnoses: diagnosiss }) =>
    diagnosisAdapter.upsertMany(diagnosiss, state)
  ),
  on(clearDiagnosis, (state) => diagnosisAdapter.removeAll(state)),
  on(saveDiagnosis, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(updateDiagnosis, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(deleteDiagnosis, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(removeDiagnosis, (state, { uuid }) => {
    // TODO: Handle delete issue
    let matchedDiagnosis = { ...state.entities[uuid], id: uuid, voided: true };
    return diagnosisAdapter.upsertOne(matchedDiagnosis, {
      ...state,
      ...loadedBaseState,
    });
  })
);

export function diagnosisReducer(
  state: DiagnosisState,
  action: Action
): DiagnosisState {
  return reducer(state, action);
}
