import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { BaseState, initialBaseState } from "./base.state";

export interface DHIS2ReportsState extends BaseState, EntityState<any> {
  reportsConfigs: any[];
  loadedConfigs: boolean;
  loadingConfigs: boolean;
  loadingConfigsError: any;
  sentDataResponses: any[];
  sendingData: boolean;
  sendData: boolean;
  sendingDataError: any;
  sendingHasError: boolean;
  response: any;
  currentPeriod: any;
  reportLogs: any;
  loadingReportLogs: boolean;
  loadedReportLogs: boolean;
  loadingReportLogsHasError: boolean;
  reportLogsLoadingError: any;
  currentReportHistoryDetails: any[];
}

export const DHIS2ReportsAdapter: EntityAdapter<DHIS2ReportsState> =
  createEntityAdapter<DHIS2ReportsState>();

export const initialDHIS2ReportsState = DHIS2ReportsAdapter.getInitialState({
  ...initialBaseState,
  reportsConfigs: [],
  loadedConfigs: false,
  loadingConfigs: false,
  loadingConfigsError: null,
  sentDataResponses: [],
  sendingData: false,
  sendData: false,
  sendingDataError: null,
  sendingHasError: false,
  response: null,
  currentPeriod: null,
  reportLogs: {},
  loadingReportLogs: false,
  loadedReportLogs: false,
  loadingReportLogsHasError: false,
  reportLogsLoadingError: null,
  currentReportHistoryDetails: [],
});
