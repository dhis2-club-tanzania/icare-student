import { createSelector } from "@ngrx/store";
import { getRootState, AppState } from "../reducers";
import { DHIS2ReportsAdapter, DHIS2ReportsState } from "../states";

import { filter, uniqBy } from "lodash";
import { addComparisonBetweenCurrentDataAndDataSent } from "src/app/shared/helpers/format-report.helper";
import { getMonthYearRepresentation } from "src/app/shared/helpers/format-date.helper";

const getDHIS2ReportsState = createSelector(
  getRootState,
  (state: AppState) => state.DHIS2Reports
);

const { selectAll: getAllReports, selectEntities: getAllReportsEntities } =
  DHIS2ReportsAdapter.getSelectors(getDHIS2ReportsState);

export const getDHIS2ReportsConfigs = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.reportsConfigs
);

export const getDHIS2ReportsConfigsById = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState, props) =>
    (filter(state.reportsConfigs, { id: props?.id }) || [])[0]
);

export const getDHIS2ReportsConfigsLoadedState = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.loadedConfigs
);

export const getDHIS2ReportsLoadedState = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.loaded
);

export const getAllReportLogs = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.reportLogs
);

export const getDHIS2LoadedReportsById = createSelector(
  getAllReports,
  getAllReportLogs,
  (reports, reportLogs, props) => {
    // console.log("what is here :: ", props?.id + "-" + props?.periodId);

    return (filter(reports, { id: props?.id + "-" + props?.periodId }) || [])
      ?.length > 0
      ? addComparisonBetweenCurrentDataAndDataSent(
          {
            ...(filter(reports, { id: props?.id + "-" + props?.periodId }) ||
              [])[0],
            logs: reportLogs[props?.id],
          },
          props.periodId
        )
      : null;
  }
);

export const getSendToDHIS2LOadingState = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.sendingData
);

export const getDhis2ReportLoadingState = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state?.loading
);

export const getDhis2ReportLoadingError = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.error
);

export const getSendToDHIS2SuccessState = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) =>
    state.sendData == true && !state.sendingHasError ? true : false
);

export const getErrorSendingDataToDHIS2 = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.sendingDataError
);

export const getSendingDataToDHIS2HasError = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.sendingHasError
);

export const getResponseAfterSendingData = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.response
);

export const getCurrentPeriod = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) => state.currentPeriod
);

export const getCurrentLoadedReport = createSelector(
  getCurrentPeriod,
  getAllReports,
  (period, reports, props) => {
    if (period) {
      return (filter(reports, {
        id: "dhis2.sqlGet." + props?.id + "-" + period?.id,
      }) || [])[0];
    } else {
      return null;
    }
  }
);

export const getCurrentReportLogs = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState, props) => state.reportLogs[props?.id]
);

export const getCountOfCurrentReportSubmittedToDHIS2 = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) =>
    (uniqBy(state.currentReportHistoryDetails, "period") || [])?.length
);

export const getAllReportsOfCurrentReportSentToDHIS2 = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) =>
    uniqBy(state.currentReportHistoryDetails, "period") || []
);

export const getCurrentReportsSubmittedHistory = createSelector(
  getDHIS2ReportsState,
  (state: DHIS2ReportsState) =>
    state.currentReportHistoryDetails.map((log) => {
      return {
        ...log,
        period: log?.period,
        periodName: getMonthYearRepresentation(log?.period),
        payload: JSON.parse(log?.payload),
        response_dhis: JSON.parse(log?.response_dhis),
        user: {
          display: log?.user?.display.split(" (")[0],
        },
      };
    })
);
