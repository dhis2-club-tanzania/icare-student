import { createAction, props } from '@ngrx/store';
import { DiagnosisObject } from 'src/app/shared/resources/diagnosis/models/diagnosis-object.model';
import { PatientdiagnosesCreate } from 'src/app/shared/resources/openmrs';

export const clearDiagnosis = createAction('[Diagnosis] clear diagnosis');

export const loadPreviousDiagnoses = createAction(
  '[Diagnosis] load previous diagnoses'
);

export const loadDiagnosisFail = createAction(
  '[Diagnosis] load diagnosis fail',
  props<{ error: any }>()
);

export const upsertDiagnosis = createAction(
  '[Diagnosis] upsert active diagnosis',
  props<{ diagnosis: DiagnosisObject }>()
);

export const upsertDiagnoses = createAction(
  '[Diagnosis] upsert active diagnoses',
  props<{ diagnoses: DiagnosisObject[] }>()
);

export const saveDiagnosis = createAction(
  '[Diagnosis] save diagnosis',
  props<{ diagnosis: PatientdiagnosesCreate; currentDiagnosisUuid?: string }>()
);

export const deleteDiagnosis = createAction(
  '[Diagnosis] delete diagnosis',
  props<{ uuid: string }>()
);

export const removeDiagnosis = createAction(
  '[Diagnosis] Remove diagnosis',
  props<{ uuid: string }>()
);
export const updateDiagnosis = createAction(
  '[Diagnosis] update diagnosis',
  props<{ diagnosis: PatientdiagnosesCreate; uuid: string }>()
);
