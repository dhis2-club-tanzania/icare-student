import { BaseState, initialBaseState } from './base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface PatientNotesState extends BaseState, EntityState<any> {
  patientNoteUuid: string;
}

export const patientNotesAdapter: EntityAdapter<any> = createEntityAdapter<
  any
>();

export const initialPatientNotesState = patientNotesAdapter.getInitialState({
    patientNoteUuid: null,
  ...initialBaseState
});
