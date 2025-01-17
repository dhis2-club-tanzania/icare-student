import { Injectable } from "@angular/core";
import { offset } from "highcharts";
import { from, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class PersonService {
  constructor(private httpClient: OpenmrsHttpClientService, private api: Api) {}

  getPersonDetailsByUuid(uuid: string): Observable<any> {
    return this.httpClient.get(`person/${uuid}?v=full`).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  getPatientsByIdentifier(identifier: string): Observable<any> {
    return from(
      this.api.patient.getAllPatients({ q: identifier, v: "full" })
    ).pipe(
      map((response) => {
        return response?.results?.length > 0
          ? response?.results?.map((result: any) => {
              return {
                ...result?.person,
                identifiers: result?.identifiers,
                uuid: result?.uuid,
                voided: result?.voided,
                display: result?.display,
              };
            }) || []
          : response?.results;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getPatientByUuid(uuid: string): Observable<any> {
    return this.httpClient.get(`patient/${uuid}?v=full`).pipe(
      map((response) => {
        return {
          ...response?.person,
          identifiers: response?.identifiers,
          uuid: response?.uuid,
          voided: response?.voided,
          display: response?.display,
        };
      }),
      catchError((error) => of(error))
    );
  }
}
