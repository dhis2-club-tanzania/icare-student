import { Injectable } from "@angular/core";
import { Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import {
  Notification,
  NotificationService,
} from "src/app/shared/services/notification.service";
import { getSanitizedReportGroup } from "../helpers/get-sanitized-report-group.helper";

@Injectable({ providedIn: "root" })
export class ReportParamsService {
  constructor(
    private httpClient: OpenmrsHttpClientService,
    private notificationService: NotificationService
  ) {}

  getReportGroups(): Observable<any> {
    this.notificationService.show(
      new Notification({ message: "Loading report groups", type: "LOADING" })
    );
    // TODO: Improve to ensure more than 100 reports are returned

    return zip(
      this.httpClient
        .get(
          "reportingrest/dataSetDefinition?v=custom:(uuid,name,description,parameters)&limit=100"
        )
        .pipe(
          map((dataSetResponse) => {
            return getSanitizedReportGroup({
              id: "dataSet",
              name: "DataSets",
              reports: dataSetResponse.results,
            });
          }),
          catchError(() => of(null))
        ),
      this.httpClient
        .get(
          "reportingrest/reportDefinition?v=custom:(uuid,name,description,parameters)"
        )
        .pipe(
          map((reportResponse) =>
            getSanitizedReportGroup({
              id: "reportdata",
              name: "Reports",
              reports: reportResponse.results,
            })
          ),
          catchError(() => of(null))
        ),
      this.httpClient
        .get(
          "reportingrest/cohortDefinition?v=custom:(uuid,name,description,parameters)"
        )
        .pipe(
          map((reportResponse) =>
            getSanitizedReportGroup({
              id: "cohort",
              name: "Cohort",
              reports: reportResponse.results,
            })
          ),
          catchError(() => of(null))
        )
    ).pipe(
      map((reportGroups) => {
        return (reportGroups || []).filter((reportGroup) => reportGroup);
      })
    );
  }

  getReportExtraParams() {
    return this.httpClient.get("systemsetting?q=dhis.reportsConfigs&v=full");
  }
}
