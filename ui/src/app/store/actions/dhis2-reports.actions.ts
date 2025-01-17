import { createAction, props } from '@ngrx/store';

export const loadDHIS2ReportsConfigs = createAction(
  '[DHIS2 integration] load configs'
);

export const addLoadedReportsConfigs = createAction(
  '[DHIS2 Integration] add loaded reports configs',
  props<{ configs: any }>()
);

export const loadReport = createAction(
  '[DHIS2 Integration] load DHIS2 report',
  props<{ params: any }>()
);

export const addLoadedReportsData = createAction(
  '[DHIS2 Integration] add loaded report',
  props<{ report: any }>()
);

export const loadingReportsConfigsFail = createAction(
  '[DHIS2 Integration] loading reports configs fails',
  props<{ error: any }>()
);

export const loadingReportsFail = createAction(
  '[DHIS2 Integration] loading reports fails',
  props<{ error: any }>()
);

export const sendDataToDHIS2 = createAction(
  '[DHIS2 Integration] send data to DHIS2',
  props<{ data: any; report: any; period: string }>()
);

export const sendingDataFails = createAction(
  '[DHIS2 Integration] sending data fails, check the OMOD',
  props<{ error: any }>()
);

export const addSentDataResponse = createAction(
  '[DHIS2 Integration] add response for data sent',
  props<{ response: any }>()
);

export const clearSendingDataStatus = createAction(
  '[DHIS2 Integration] clear sending data'
);

export const setCurrentPeriod = createAction(
  '[DHIS2 Integration] set current period',
  props<{ period: any }>()
);

export const loadReportLogsByPeriod = createAction(
  '[DHIS2 Integration] load report logs by report period',
  props<{ periodId: string }>()
);

export const loadReportLogs = createAction(
  '[DHIS2 Integration] load report logs',
  props<{ periodId: string; reportId: string }>()
);

export const addLoadedReportLogs = createAction(
  '[DHIS2 Integration] add loaded reports',
  props<{ reports: any[] }>()
);

export const loadReportLogsByReportId = createAction(
  '[DHIS2 Integration] load report logs by report ID',
  props<{ reportId: string }>()
);

export const loadingReportLogsFail = createAction(
  '[DHIS2 Integration] loading report logs fail',
  props<{ error: any }>()
);

export const addLoadedReportLogsHistory = createAction(
  '[DHIS2 Integration] add loaded report log history',
  props<{ reportLogs: any[] }>()
);

export const sendEventData = createAction(
  '[DHIS2 Integration] send event data',
  props<{ data: any; reportConfigs: any; eventDate: string; mrn: string }>()
);

export const updateSendingEventDataStatus = createAction(
  '[DHIS2 Integration] update sending data status',
  props<{ response: any }>()
);

export const sendingEventsDataFails = createAction(
  '[DHIS2 Integration] sending events data failed',
  props<{ error: any }>()
);

export const clearReportSelections = createAction(
  '[DHIS2 Integration] clear report selections'
);
