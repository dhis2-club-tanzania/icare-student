import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class AdditionalFieldsService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  createAdditionalFields(data: any[]): Observable<any> {
    return this.httpClient.post(`lab/associatedfields`, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  getAdditionalFields(): Observable<any> {
    return this.httpClient.get(`lab/associatedfields`).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  createTestAllocationAssociatedFields(data: any[]): Observable<any> {
    return this.httpClient
      .post(`lab/testallocationassociatedfields`, data)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => of(error))
      );
  }

  saveAssociatedfieldresults(data: any[]): Observable<any[]> {
    return this.httpClient.post(`lab/associatedfieldresults`, data).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }
}
