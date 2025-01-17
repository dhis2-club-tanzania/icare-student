import { createAction, props } from '@ngrx/store';
import { SpecimenSourcesAndLabTestsModal } from '../../resources/models';
import { ErrorMessage } from 'src/app/shared/modules/openmrs-http-client/models/error-message.model';

export const updateTestStatus = createAction(
  '[Tests management] update test status',
  props<{ labTest: SpecimenSourcesAndLabTestsModal }>()
);

export const loadSpecimenSourcesGlobalPropertyUuid = createAction(
  '[Specimen source] load specimen source configuration'
);

export const loadSpecimenSources = createAction(
  '[Specimen sources] load specimen sources'
);

export const addLoadedSpecimenSources = createAction(
  '[Specimen sources] add loaded specimen source',
  props<{ specimenSources: SpecimenSourcesAndLabTestsModal[] }>()
);

export const loadingSpecimenSourcesFails = createAction(
  '[Specimen sources] loading specimen sources fails',
  props<{ error: ErrorMessage }>()
);
