import { createAction, props } from '@ngrx/store';
import { ConceptGetFull } from 'src/app/shared/resources/openmrs';
import { ErrorMessage } from 'src/app/shared/modules/openmrs-http-client/models/error-message.model';

// concept?code=Diagnosis+Concept+Set&source=org.openmrs.module.emrapi&v=custom:(uuid,name,setMembers)

export const loadConcept = createAction(
  '[Concept] load concept',
  props<{ name: string; fields: string }>()
);

export const upsertLoadedConcept = createAction(
  '[Concept] add loaded concepts',
  props<{ concepts: ConceptGetFull[] }>()
);

export const loadingConceptFails = createAction(
  '[Concept] loading concept fail',
  props<{ error: ErrorMessage }>()
);

export const loadConceptByUuid = createAction(
  '[Concept] load concept by uuid',
  props<{ uuid: string; fields?: string }>()
);
