import { Injectable } from "@angular/core";
import { from, Observable, zip } from "rxjs";
import { map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";

import { keyBy, flatten } from "lodash";

@Injectable({
  providedIn: "root",
})
export class DatasetReportsService {
  constructor(private httpClient: OpenmrsHttpClientService, private api: Api) {}

  getEvaluatedDatasetReport(
    uuids: string[],
    selectionDates: any
  ): Observable<any> {
    return zip(
      ...uuids.map((uuid) => {
        return this.httpClient
          .get(
            `reportingrest/dataSet/` +
              uuid +
              `?startDate=` +
              selectionDates?.startDate +
              `&endDate=` +
              selectionDates?.endDate
          )
          .pipe(
            map((response) => {
              return {
                ...response,
                keyedData: keyBy(
                  response?.rows?.forEach((row) => {
                    const key = Object?.keys(row)[0];
                    return {
                      key,
                      value: row[key],
                    };
                  }),
                  "key"
                ),
              };
            })
          );
      })
    ).pipe(map((data) => flatten(data)));
  }
}
