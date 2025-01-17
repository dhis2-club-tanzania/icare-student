import { createReducer, on } from '@ngrx/store';
import {
  updateCurrentPatient,
  removeCurrentPatient,
  addCurrentPatient,
  admitPatient,
  setAsAdmitted,
  failedToAdmitt,
  transferPatient,
  setAsTransferred,
} from '../actions';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';
import {
  CurrentPatientState,
  initialCurrentPatientState,
} from '../states/current-patient.state';

const reducer = createReducer(
  initialCurrentPatientState,
  on(addCurrentPatient, (state, { patient }) => ({
    ...state,
    ...loadedBaseState,
    patient,
    // auditInfo: patient?.auditInfo,
    // links: patient?.links,
    // uuid: patient?.uuid,
    // display: patient?.display,
    // identifiers: patient?.identifiers,
    // preferred: patient?.preferred,
    // voided: patient?.voided,
    // person: patient?.person,
  })),
  on(updateCurrentPatient, (state, { patient }) => ({
    ...state,
    ...loadingBaseState,
    patient,
  })),
  on(removeCurrentPatient, (state) => ({
    ...state,
    ...loadedBaseState,
    auditInfo: null,
    links: null,
    uuid: null,
    display: null,
    identifiers: null,
    preferred: null,
    voided: null,
    person: null,
  })),
  on(admitPatient, (state) => ({
    ...state,
    ...loadingBaseState,
    admitted: false,
  })),
  on(setAsAdmitted, (state) => ({
    ...state,
    ...loadedBaseState,
    admitted: true,
  })),
  on(failedToAdmitt, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(transferPatient, (state) => ({
    ...state,
    ...loadingBaseState,
    transferred: false,
  })),
  on(setAsTransferred, (state) => ({
    ...state,
    ...loadedBaseState,
    transferred: true,
  }))
);

export function currentPatientReducer(state, action): CurrentPatientState {
  return reducer(state, action);
}
