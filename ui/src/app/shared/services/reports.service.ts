import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { uniqBy, orderBy } from "lodash";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { BASE_URL } from "../constants/constants.constants";
import { getReportPeriodObjectFromPeriodId } from "../helpers/format-dates-types.helper";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  constructor(private httpClient: HttpClient) {}

  getReport(reportParams) {
    /*console.log(
      'SERVICE IMEITWA :: @@ ',
      `reportingrest/${reportParams?.reportGroup}/${
        reportParams?.reportId
      }?${reportParams?.params?.join('&')}`
    );*/

    return this.httpClient
      .get(
        `${BASE_URL}reportingrest/${reportParams.reportGroup}/${
          reportParams.reportId
        }?${reportParams.params.join("&")}`
      )
      .pipe(
        map((response) => {
          return reportParams.reportGroup === "dataSet"
            ? { dataSets: [response] }
            : response;
        }),
        catchError((e) => of(e))
      );
  }

  getReportsConfigs(): Observable<any> {
    return this.httpClient
      .get(
        BASE_URL +
          "bahmnicore/sql/globalproperty?property=bahmni.DHIS2Reports.configurations"
      )
      .pipe(
        map((response) => response),
        catchError((e) => of(e))
      );
  }

  getExtraParams() {
    return this.httpClient
      .get(BASE_URL + "systemsetting?q=dhis.reportsConfigs&v=full")
      .pipe(
        map((response) => response),
        catchError((e) => of(e))
      );
  }

  getReportLogsByReportId(reportId: string): Observable<any> {
    return this.httpClient.get(BASE_URL + `dhis2/logs?report=${reportId}`).pipe(
      map((response: any[]) => {
        return orderBy(
          uniqBy(response, "period")?.map((report) => {
            return {
              ...report,
              payload: JSON.parse(report?.payload),
              response_dhis: JSON.parse(report?.response_dhis),
              periodDefn: getReportPeriodObjectFromPeriodId(report?.period),
            };
          }),
          ["period"],
          ["desc"]
        );
      }),
      catchError((e) => of(e))
    );
  }

  getReportLogs(reportId, periodId): Observable<any> {
    return this.httpClient
      .get(BASE_URL + `dhis2/logs?report=${reportId}&period=${periodId}`)
      .pipe(
        map((response) => response),
        catchError((e) => of(e))
      );
  }

  getReportLogsByPeriodId(periodId): Observable<any> {
    return this.httpClient.get(BASE_URL + `dhis2/logs?period=${periodId}`).pipe(
      map((response) => response),
      catchError((e) => of(e))
    );
  }

  sendEventData(data, reportConfigs, eventDate, mrn): Observable<any> {
    return this.httpClient
      .post(BASE_URL + "dhis2/event", {
        identifier: mrn,
        eventProgram: reportConfigs?.program,
        eventDate: eventDate,
        eventPayload: JSON.stringify(data),
      })
      .pipe(
        map((response: any) => {
          if (response) {
            return response;
          } else {
            return {
              status: "MISSING_API",
              description: "API is missing",
            };
          }
        }),
        catchError((e) => of(e))
      );
  }

  sendDataToDHIS2(data, report, period): Observable<any> {
    return this.httpClient
      .post(BASE_URL + "dhis2/dataset", {
        report_id: report?.id,
        period: period,
        report_name: report?.name,
        payload: JSON.stringify(data),
      })
      .pipe(
        map((response: any) => {
          if (response) {
            return response;
          } else {
            return {
              status: "MISSING_API",
              description: "API is missing",
            };
          }
        }),
        catchError((e) => of(e))
      );
  }
}
