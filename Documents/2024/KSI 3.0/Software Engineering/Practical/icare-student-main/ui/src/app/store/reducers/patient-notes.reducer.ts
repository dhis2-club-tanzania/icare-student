import { createReducer, on } from '@ngrx/store';
import { initialPatientNotesState, patientNotesAdapter } from '../states';
import {
  addLoadedPatientNoteUuid,
  loadPatientNotes,
  addLoadedPatientNotes,
  loadingPatientNotesFails
} from '../actions';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState
} from '../states/base.state';

const reducer = createReducer(
  initialPatientNotesState,
  on(addLoadedPatientNoteUuid, (state, { id }) => ({
    ...state,
    ...loadedBaseState,
    patientNoteUuid: id
  })),
  on(loadPatientNotes, state => ({
    ...state,
    ...loadingBaseState
  })),
  on(addLoadedPatientNotes, (state, { patientNotes }) => {
    return patientNotesAdapter.addMany(patientNotes, {
      ...state,
      ...loadedBaseState
    });
  }),
  on(loadingPatientNotesFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState
  }))
);

export function patientNotesReducer(state, action) {
  return reducer(state, action);
}
