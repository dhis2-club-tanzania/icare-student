import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class DatasetDataService {
  constructor(private httpClient: OpenmrsHttpClientService, private api: Api) {}

  getDatasetData(
    uuid: string,
    selectionDates: any,
    otherParameters?: any[]
  ): Observable<any> {
    return this.httpClient
      .get(
        `reportingrest/dataSet/` +
          uuid +
          `?startDate=` +
          selectionDates?.startDate +
          `&endDate=` +
          selectionDates?.endDate +
          `&${otherParameters
            ?.map((param) => param?.key + "=" + param?.value)
            .join("&")}`
      )
      .pipe(
        map((report) => {
          return report;
        })
      );
  }

  getDataSets(): Observable<any[]> {
    return from(this.api.reportingrest.getAllDataSetDefinitions()).pipe(
      map((response) => response?.results)
    );
  }
}
