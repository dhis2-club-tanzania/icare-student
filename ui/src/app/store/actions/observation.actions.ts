import { createAction, props } from "@ngrx/store";
import { ObservationObject } from "src/app/shared/resources/observation/models/obsevation-object.model";
import { ObsCreate, ObsUpdate } from "src/app/shared/resources/openmrs";

export const clearObservations = createAction(
  "[Observation] clear observations"
);

export const loadPreviousObservations = createAction(
  "[Observation] load previous observations"
);

export const loadObservationFail = createAction(
  "[Observation] load observation fail",
  props<{ error: any }>()
);

export const upsertObservation = createAction(
  "[Observation] upsert observation",
  props<{ observation: ObservationObject }>()
);

export const upsertObservations = createAction(
  "[Observation] upsert observations",
  props<{ observations: ObservationObject[] }>()
);

export const createObservation = createAction(
  "[Observation] create observation",
  props<{ observation: ObservationObject }>()
);

export const saveObservations = createAction(
  "[Observation] save observations",
  props<{ observations: ObsCreate[] | ObsUpdate[]; patientId: string }>()
);

export const saveObservationsFail = createAction(
  "[Observation] save observations fail",
  props<{ error: any }>()
);

export const addObservationsToEncounter = createAction(
  "[Observation] add observations to encounter",
  props<{ details: any }>()
);

export const saveObservationsUsingEncounter = createAction(
  "[Observation] save observations using encounter",
  props<{ data: any; patientId: string }>()
);

export const saveObservationsForFiles = createAction(
  "[Observation] save observations for files",
  props<{ data: any; patientId: string; encounter: string }>()
);
