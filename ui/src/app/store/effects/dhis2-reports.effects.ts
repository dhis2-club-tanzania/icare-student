import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { formatReportResponse } from "src/app/shared/helpers/format-report.helper";
import { ReportsService } from "src/app/shared/services/reports.service";
import {
  addLoadedReportLogs,
  addLoadedReportLogsHistory,
  addLoadedReportsConfigs,
  addLoadedReportsData,
  addSentDataResponse,
  clearSendingDataStatus,
  loadDHIS2ReportsConfigs,
  loadingReportLogsFail,
  loadingReportsConfigsFail,
  loadingReportsFail,
  loadReport,
  loadReportLogs,
  loadReportLogsByReportId,
  sendDataToDHIS2,
  sendEventData,
  sendingDataFails,
  sendingEventsDataFails,
  updateSendingEventDataStatus,
} from "../actions";
import { AppState } from "../reducers";
import * as _ from "lodash";

@Injectable()
export class DHIS2ReportsEffects {
  reportsConfigs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDHIS2ReportsConfigs),
      switchMap(() => {
        return this.reportsService.getExtraParams().pipe(
          map((response: any) => {
            let arrayOfRepConfigs = _.filter(response?.results, (res) => {
              return res?.property == "dhis.reportsConfigs" ? true : false;
            });

            let RepConfigsJson =
              arrayOfRepConfigs?.length > 0
                ? JSON.parse(arrayOfRepConfigs[0]?.value)
                : {};

            let configsArray = [];

            _.each(Object.keys(RepConfigsJson), (key) => {
              configsArray.push(RepConfigsJson[key]);
            });
            return addLoadedReportsConfigs({ configs: configsArray });
          })
        );
      }),
      catchError((error) => of(loadingReportsConfigsFail({ error })))
    )
  );

  report$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReport),
      switchMap((action) => {
        return this.reportsService.getReport(action.params).pipe(
          switchMap((response: any) => {
            const configs = action.params.configs;
            return [
              clearSendingDataStatus(),
              addLoadedReportsData({
                report: {
                  id: configs.id + "-" + action?.params?.periodId,
                  ...formatReportResponse(
                    response?.dataSets?.length > 0
                      ? response?.dataSets[0]?.rows
                      : [],
                    configs,
                    response?.dataSets[0]?.metadata?.columns
                  ),
                },
              }),
            ];
          }),
          catchError((error) => {
            return of(loadingReportsFail({ error }));
          })
        );
      })
    )
  );

  sendReportToDHIS2$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendDataToDHIS2),
      switchMap((action) => {
        return this.reportsService
          .sendDataToDHIS2(action.data, action.report, action.period)
          .pipe(
            map((response) => {
              return addSentDataResponse({
                response,
              });
            })
          );
      }),
      catchError((error) => of(sendingDataFails({ error })))
    )
  );

  sendEventsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendEventData),
      switchMap((action) => {
        return this.reportsService
          .sendEventData(
            action.data,
            action.reportConfigs,
            action.eventDate,
            action.mrn
          )
          .pipe(
            map((response) => {
              return updateSendingEventDataStatus({ response });
            })
          );
      }),
      catchError((error) => of(sendingEventsDataFails({ error })))
    )
  );

  reportLogsByReportId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReportLogsByReportId),
      switchMap((action) =>
        this.reportsService
          .getReportLogsByReportId(action.reportId)
          .pipe(
            map((response) =>
              addLoadedReportLogsHistory({ reportLogs: response })
            )
          )
      ),
      catchError((error) => of(loadingReportLogsFail({ error })))
    )
  );

  reportLogsLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReportLogs),
      switchMap((action) =>
        this.reportsService
          .getReportLogs(action.reportId, action.periodId)
          .pipe(map((response) => addLoadedReportLogs({ reports: response })))
      ),
      catchError((error) => of(loadingReportLogsFail({ error })))
    )
  );

  constructor(
    private actions$: Actions,
    private reportsService: ReportsService,
    private store: Store<AppState>
  ) {}
}
