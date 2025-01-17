import { createAction, props } from '@ngrx/store';

export const loadActiveVisitsForSampleManagement = createAction(
  '[Visits] load all active visits for sample management',
  props<{ visits: any; sampleTypes: any; billingInfo: any }>()
);

export const upsertCollectedSamples = createAction(
  '[Samples] add collected samples',
  props<{ collectedSamples: any[] }>()
);

export const upsertSample = createAction(
  '[Samples] add sample',
  props<{ sample: any }>()
);

export const loadingActiveVisitsForSamplesFails = createAction(
  '[Samples] loading active visits fails',
  props<{ error: any }>()
);

export const saveObservation = createAction(
  '[Observation] save observation',
  props<{ observation: any; sample: any }>()
);

export const savingObservationFails = createAction(
  '[Observation] saving observation fails',
  props<{ error: any }>()
);

export const updateSample = createAction(
  '[Sample] update sample',
  props<{ sample: any }>()
);
