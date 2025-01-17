import { createAction, props } from '@ngrx/store';
import { Consultation } from 'src/app/core/models';
import { ErrorMessage } from 'src/app/shared/modules/openmrs-http-client/models/error-message.model';

export const startConsultation = createAction(
  '[Consultation] Start consultation'
);

export const startConsultationError = createAction(
  '[Consultation] Start consultation error',
  props<{ error: any }>()
);

export const upsertConsultation = createAction(
  '[Consultation] Upsert consultation',
  props<{ consultation: Consultation }>()
);

export const saveConsultation = createAction(
  '[Consultation] Save consultation',
  props<{ consultation: Consultation }>()
);

export const saveConsultationSuccess = createAction(
  '[Consultation] Save consultation success'
);

export const saveConsultationFail = createAction(
  '[Consultation] Save consultation fail',
  props<{ error: ErrorMessage }>()
);

export const finishConsultation = createAction(
  '[Consultation] Finish consultation'
);

export const checkIfConsultationIsStarted = createAction(
  '[Consultation] Check if consultation is started'
);

export const createDiagnosticEncounter = createAction(
  '[Diagnostic service] create encounter'
);
