import { Injectable } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class OpenMRSFormsService {
  constructor(private httpClient: OpenmrsHttpClientService, private api: Api) {}

  getAllForms(parameters?: string[]): Observable<any[]> {
    return this.httpClient
      .get(
        `form?${
          !parameters
            ? "paging=false&v=custom:(uuid,display,name)"
            : parameters.join("&")
        }`
      )
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => of(error))
      );
  }
}
