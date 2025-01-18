import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class GenerateMetadataLabelsService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getLabMetadatalabels(parameters: any): Observable<any[]> {
    return this.httpClient
      .get(
        `lab/labidgen?globalProperty=${parameters?.globalProperty}&metadataType=${parameters?.metadataType}`
      )
      .pipe(
        map((response) => response),
        catchError((error) => of([error]))
      );
  }
}
