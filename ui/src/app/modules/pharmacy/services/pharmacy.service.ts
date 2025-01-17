import { Injectable } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class PharmacyService {
  constructor(private api: Api, private httpClient: OpenmrsHttpClientService) {}

  getEncounters(parameters?: any): Observable<any> {
    return from(this.api.encounter.getAllEncounters(parameters)).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => of(error))
    );
  }

  getEncountersByPagination(parameters?: any): Observable<any> {
    return this.httpClient
      .get(
        `icare/encounters?${
          parameters
            ? (
                Object.keys(parameters).map(
                  (key: string) => key + "=" + parameters[key]
                ) || []
              ).join("&")
            : ""
        }`
      )
      .pipe(
        map((response: any) => response),
        catchError((error: any) => of(error))
      );
  }
}
