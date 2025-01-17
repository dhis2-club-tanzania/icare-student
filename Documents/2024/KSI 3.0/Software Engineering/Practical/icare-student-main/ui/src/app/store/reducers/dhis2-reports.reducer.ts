import { createReducer, on } from '@ngrx/store';
import {
  addLoadedReportLogs,
  addLoadedReportLogsHistory,
  addLoadedReportsConfigs,
  addLoadedReportsData,
  addSentDataResponse,
  clearReportSelections,
  clearSendingDataStatus,
  loadDHIS2ReportsConfigs,
  loadingReportLogsFail,
  loadingReportsConfigsFail,
  loadingReportsFail,
  loadReport,
  loadReportLogs,
  loadReportLogsByReportId,
  sendDataToDHIS2,
  sendingDataFails,
  setCurrentPeriod,
} from '../actions';
import { DHIS2ReportsAdapter, initialDHIS2ReportsState } from '../states';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from '../states/base.state';

import { keyBy, groupBy } from 'lodash';
import { state } from '@angular/animations';

const reducer = createReducer(
  initialDHIS2ReportsState,
  on(loadDHIS2ReportsConfigs, (state) => ({
    ...state,
    loadingConfigs: true,
    loadedConfigs: false,
  })),
  on(loadingReportLogsFail, (state, { error }) => ({
    ...state,
    loadingReportLogs: false,
    loadedReportLogs: false,
    loadingReportLogsHasError: true,
  })),
  on(addLoadedReportsConfigs, (state, { configs }) => ({
    ...state,
    reportsConfigs: configs,
    loadingConfigs: false,
    loadedConfigs: true,
  })),
  on(loadingReportsConfigsFail, (state, { error }) => ({
    ...state,
    loadingConfigsError: error,
    loadingConfigs: false,
    loadedConfigs: true,
  })),
  on(loadReport, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedReportsData, (state, { report }) =>
    DHIS2ReportsAdapter.addOne(report, { ...state, ...loadedBaseState })
  ),
  on(loadingReportsFail, (state, { error }) => {
    console.log('nnafika? : ', error);

    return {
      ...state,
      error,
      loading: false,
      hasError: true,
    };
  }),
  on(sendDataToDHIS2, (state) => ({
    ...state,
    sendingData: true,
    sendData: false,
    sendingDataError: null,
    sendingHasError: false,
  })),
  on(addSentDataResponse, (state, { response }) => ({
    ...state,
    sendData: true,
    sendingData: false,
    sendingDataError: null,
    sendingHasError: false,
    response,
  })),
  on(sendingDataFails, (state, { error }) => ({
    ...state,
    sendData: true,
    sendingData: false,
    sendingDataError: error,
    sendingHasError: true,
    response: error,
  })),
  on(clearSendingDataStatus, (state) => ({
    ...state,
    sendData: false,
    sendingData: false,
    sendingDataError: null,
    sendingHasError: false,
    response: null,
  })),
  on(setCurrentPeriod, (state, { period }) => ({
    ...state,
    currentPeriod: period,
  })),
  on(loadReportLogs, (state) => ({
    ...state,
    loadingReportLogs: true,
    loadedReportLogs: false,
    loadingReportLogsHasError: false,
    reportLogsLoadingError: null,
  })),
  on(loadReportLogsByReportId, (state) => ({
    ...state,
    loadingReportLogs: true,
    loadedReportLogs: false,
    loadingReportLogsHasError: false,
    reportLogsLoadingError: null,
  })),
  on(addLoadedReportLogs, (state, { reports }) => ({
    ...state,
    reportLogs: { ...state.reportLogs, ...groupBy(reports, 'report_id') },
    loadingReportLogs: false,
    loadedReportLogs: true,
    loadingReportLogsHasError: false,
    reportLogsLoadingError: null,
  })),
  on(addLoadedReportLogsHistory, (state, { reportLogs }) => ({
    ...state,
    loadingReportLogs: false,
    loadedReportLogs: true,
    loadingReportLogsHasError: false,
    reportLogsLoadingError: null,
    currentReportHistoryDetails: reportLogs,
  })),
  on(clearReportSelections, (state) => ({
    ...state,
    ids: [],
    entities: {},
    loading: false,
    loaded: false,
    hasError: false,
    error: null,
    loadingReportLogs: false,
    loadReportLogs: false,
    loadingReportLogsHasError: false,
    sendingDataError: false,
    sendingHasError: false,
    sendData: false,
    sendingData: false,
    currentReportHistoryDetails: [],
  }))
);

export function DHIS2ReportsReducer(state, action) {
  return reducer(state, action);
}
