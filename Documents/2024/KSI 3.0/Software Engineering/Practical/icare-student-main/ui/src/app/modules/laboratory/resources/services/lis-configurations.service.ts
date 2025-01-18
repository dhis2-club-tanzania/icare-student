import { Injectable } from "@angular/core";
import { Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";
import { LISConfigurationsModel } from "../models/lis-configurations.model";

@Injectable({
  providedIn: "root",
})
export class LISConfigurationsService {
  constructor(private api: Api, private httpClient: OpenmrsHttpClientService) {}

  getLISConfigurations(): Observable<LISConfigurationsModel> {
    return zip(
      this.httpClient.get(`systemsetting?q=iCare.LIS&v=full`).pipe(
        map((response) => {
          return response && response?.results[0]?.value === "true"
            ? true
            : false;
        }),
        catchError((error) => of(error))
      ),
      this.httpClient
        .get(`systemsetting?q=iCare.Laboratory.agencyConceptUuid&v=full`)
        .pipe(
          map((response) => {
            return response ? response?.results[0]?.value : null;
          }),
          catchError((error) => of(error))
        )
    ).pipe(
      map((response) => {
        return {
          isLIS: response[0],
          agencyConceptUuid: response[1],
        };
      })
    );
  }
}
