import { createAction, props } from "@ngrx/store";

export const loadActiveVisits = createAction(
  "[Visits details] load visits details",
  props<{ parameters: any }>()
);

export const addLoadedVisitsDetails = createAction(
  "[Visits details] add loaded visits details",
  props<{ visits: any[] }>()
);

export const loadingVisitsDetailsFails = createAction(
  "[Visits details] loading visits details fails",
  props<{ error: any }>()
);

export const setVisitsParameters = createAction(
  "[Visits details] set parameters",
  props<{ parameters: any }>()
);

export const loadActiveVisitsWithLabOrders = createAction(
  "[Visits] load active visits",
  props<{ startDate: Date; endDate: Date }>()
);

export const addLoadedActiveVisitsWithLabOrders = createAction(
  "[Visits] add loaded active visits",
  props<{ activeVisits: any[] }>()
);

export const loadingActiveVisitsWithLabOrdersFails = createAction(
  "[Visits] loading active visits fails",
  props<{ error: any }>()
);

export const loadPatientsVisitDetailsByVisitUuids = createAction(
  "[Visits] load visits details",
  props<{ visits: string[] }>()
);

export const addPatientVisitsDetails = createAction(
  "[Visits] add visits details",
  props<{ visits: any[] }>()
);

export const loadingPatientsVisitsFails = createAction(
  "[Visits] laoding visits fails",
  props<{ error: any }>()
);

export const loadAllLabActiveVisitDetailsByVisitUuids = createAction(
  "[Visits] load  active visits details",
  props<{ visits: string[] }>()
);

export const addReloadedPatientsVisits = createAction(
  "[Visits] add reloaded patients",
  props<{ newPatients: any }>()
);

export const clearVisitsDatesParameters = createAction(
  "[Visits] Clear visit dates paramater"
);
