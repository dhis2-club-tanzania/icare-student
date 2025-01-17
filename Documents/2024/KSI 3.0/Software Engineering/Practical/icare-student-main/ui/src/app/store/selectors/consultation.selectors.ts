import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VisitObject } from 'src/app/shared/resources/visits/models/visit-object.model';
import { getCurrentPatient } from 'src/app/store/selectors/current-patient.selectors';
import { getActiveVisit } from 'src/app/store/selectors/visit.selectors';
import { AppState, getRootState } from '../reducers';
import { ConsultationState } from '../states/consultation.state';

const getConsultationState = createSelector(
  getRootState,
  (state: AppState) => state.consultation
);

export const getConsultationEncounterUuid = createSelector(
  getConsultationState,
  (state: ConsultationState) => (state ? state.encounterUuid : null)
);

export const getConsultationActiveVisit = createSelector(
  getConsultationEncounterUuid,
  getActiveVisit,
  (encounterUuid: string, visit: VisitObject) => ({ ...visit, encounterUuid })
);

export const getStartingConsultationLoadingStatus = createSelector(
  getConsultationState,
  (state: ConsultationState) => state.loading
);

export const getConsultationInProgressStatus = createSelector(
  getCurrentPatient,
  (patient) => {
    const consultation = JSON.parse(
      localStorage.getItem('patientConsultation')
    );

    return consultation?.patientUuid === patient?.id;
  }
);
