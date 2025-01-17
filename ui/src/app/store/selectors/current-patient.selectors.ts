import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import { CurrentPatientState } from '../states/current-patient.state';

export const getCurrentPatientState = createSelector(
  getRootState,
  (state: AppState) => state?.currentPatient
);

export const getCurrentPatient = createSelector(
  getCurrentPatientState,
  (patientState: CurrentPatientState) => {
    return patientState?.patient;
  }
);

export const getAdmittingLoadingState = createSelector(
  getCurrentPatientState,
  (state: CurrentPatientState) => state?.loading
);

export const getTransferLoadingState = createSelector(
  getCurrentPatientState,
  (state: CurrentPatientState) => state?.loading
);

export const getAdmissionStatusOfCurrentPatient = createSelector(
  getCurrentPatientState,
  (state: CurrentPatientState) => state?.admitted
);

export const getTransferStatusOfCurrentPatient = createSelector(
  getCurrentPatientState,
  (state: CurrentPatientState) => state?.transferred
);
