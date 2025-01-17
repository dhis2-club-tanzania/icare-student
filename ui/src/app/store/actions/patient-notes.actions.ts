import { createAction, props } from '@ngrx/store';


export const addLoadedPatientNoteUuid = createAction(
  '[PatientNote] add PatientNote uuid',
  props<{ id: string }>()
);

export const loadPatientNotes = createAction('[Patient Notes] load Patient Notes',
    props<{patientUuid: string, conceptUuid: string}>()
  );

export const addLoadedPatientNotes = createAction(
  '[Patient Notes] add loaded Patient Notes',
  props<{ patientNotes: any[] }>()
);

export const loadingPatientNotesFails = createAction(
  '[Patient Note]s loading Patient Note sfails',
  props<{ error: any }>()
);