import { createAction, props } from '@ngrx/store';

export const loadPatientsDetails = createAction(
  '[Patient] load patients details',
  props<{ patientId: string }>()
);

export const addLoadedPatientsDetails = createAction(
  '[Patient] add loaded patients',
  props<{ patient: any }>()
);

export const loadingPatientsFail = createAction(
  '[Patient] loading patients fail',
  props<{ error: any }>()
);

export const savePatientSample = createAction(
  '[Patient] save patient sample',
  props<{ sample: any; details: any; priorityDetails: any }>()
);

export const addPatientSamples = createAction(
  '[Patient] add patient samples',
  props<{ samples: any }>()
);

export const addCollectedSample = createAction(
  '[Patient] add collected sample',
  props<{ sample: any }>()
);

export const clearCurrentPatient = createAction(
  '[Patient] clear current patient details'
);

export const clearPatientSamples = createAction(
  '[Patient] clear patient samples'
);

export const clearLoadedPatients = createAction(
  '[Patients] clear loaded patients'
);

export const setLabSampleStatus = createAction(
  '[Patients] set sample status',
  props<{ statusDetails: any; sample: any }>()
);

export const updatePatientLabSample = createAction(
  '[Patient] update collected sample',
  props<{ sample: any }>()
);
