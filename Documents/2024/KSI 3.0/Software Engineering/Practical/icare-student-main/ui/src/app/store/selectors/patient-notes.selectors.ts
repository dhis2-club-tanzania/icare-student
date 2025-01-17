import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import { patientNotesAdapter, PatientNotesState } from '../states';

const getPattientNotesState = createSelector(
  getRootState,
  (state: AppState) => state.patientNotes
);

export const getPatientNotesLoadedState = createSelector(
  getPattientNotesState,
  (state: PatientNotesState) => state.loaded
);

export const getPatientNoteUuid = createSelector(
  getPattientNotesState,
  (state: PatientNotesState) => state.patientNoteUuid
);

export const {
  selectAll: getAllPatientNotes,
  selectEntities: getPatientNotesEntities,
} = patientNotesAdapter.getSelectors(getPattientNotesState);

export const getPatientClinicalNotes = createSelector(
  getPatientNotesEntities,
  (entities, props) => {
    return entities[props.id];
  }
);
