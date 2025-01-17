import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import { diagnosisAdapter, DiagnosisState } from '../states';

export const getDiagnosisState = createSelector(
  getRootState,
  (state: AppState) => state?.diagnosis
);

export const {
  selectAll: getAllDiagnoses,
  selectEntities: getDiagnosisEntities,
} = diagnosisAdapter.getSelectors(getDiagnosisState);

export const getSavingDiagnosisState = createSelector(
  getDiagnosisState,
  (state: DiagnosisState) => state.loading
);

export const getIfThereIsAnyDiagnosisInTheCurrentActiveVisit = createSelector(
  getAllDiagnoses,
  (diagnoses: any) => {
    const activeDiagnoses =
      diagnoses.filter((diagnosis) => !diagnosis?.voided) || [];
    return activeDiagnoses.length > 0;
  }
);
