import { createAction, props } from "@ngrx/store";
import { VisitObject } from "src/app/shared/resources/visits/models/visit-object.model";

export const startVisit = createAction(
  "[Visit] Start visit",
  props<{ visit: any; isEmergency: boolean }>()
);

export const loadActiveVisit = createAction(
  "[Visit] load active visit",
  props<{
    patientId: string;
    isEmergency?: boolean;
    isRegistrationPage?: boolean;
  }>()
);

export const clearActiveVisit = createAction("[Visit] Clear active visit");

export const clearVisits = createAction("[Visit] clear visits");

export const loadPreviousVisit = createAction("[Visit] load previous list");

export const loadVisitFail = createAction(
  "[Visit] load visit fail",
  props<{ error: any }>()
);

export const upsertVisit = createAction(
  "[Visit] upsert active visit",
  props<{ visit: VisitObject; activeVisitUuid?: string }>()
);

export const activeVisitNotFound = createAction(
  "[Visit] active visit not found"
);

export const updateVisit = createAction(
  "[Visit] update visit",
  props<{ details: any; visitUuid: string }>()
);

export const upsertAdmittedPatientLocation = createAction(
  "[Visit] add location for admitted patient",
  props<{ locationVisitDetails: any }>()
);

export const upsertVisitDeathCheck = createAction(
  "[Visit] mark as dead",
  props<{ markedAsDead: boolean }>()
);

export const holdVisitState = createAction("[Visit] hold visit state");
