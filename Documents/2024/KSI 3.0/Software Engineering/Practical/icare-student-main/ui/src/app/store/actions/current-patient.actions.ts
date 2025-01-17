import { createAction, props } from '@ngrx/store';
import { ErrorMessage } from 'src/app/shared/modules/openmrs-http-client/models/error-message.model';
import { PatientGetFull } from '../../shared/resources/openmrs';
import { Patient } from '../../shared/resources/patient/models/patient.model';

export const addCurrentPatient = createAction(
  '[Current Patient] add current patient',
  props<{ patient: Patient; isRegistrationPage?: boolean }>()
);

export const loadCurrentPatient = createAction(
  '[Current Patient] load current patient',
  props<{ uuid: string; isRegistrationPage?: boolean; visitUuid?: string }>()
);

export const loadCurrentPatientFail = createAction(
  '[Current Patient] load current patient fail',
  props<{ error: any }>()
);

export const updateCurrentPatient = createAction(
  '[Current Patient] update current patient',
  props<{ patient: Patient }>()
);

export const removeCurrentPatient = createAction(
  '[Current Patient] remove current patient'
);

export const admitPatient = createAction(
  '[Admit] admit patient',
  props<{ admissionDetails: any; path: string }>()
);

export const setAsAdmitted = createAction('[Admit] set admit');

export const failedToAdmitt = createAction(
  '[Admit] failed top admit',
  props<{ error: ErrorMessage }>()
);

export const transferPatient = createAction(
  '[Transfer] transfer patient',
  props<{
    transferDetails: any;
    path: string;
    params?: any;
    currentVisitLocation?: string;
    visitAttributes?: any[];
  }>()
);

export const setAsTransferred = createAction('[Transfer] set as transferred');
