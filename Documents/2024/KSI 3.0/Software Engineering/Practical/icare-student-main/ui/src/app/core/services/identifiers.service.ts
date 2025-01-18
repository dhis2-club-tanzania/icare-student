import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class IdentifiersService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  generateIds(payload: any): Observable<any> {
    return this.httpClient.post("icare/idgen", payload).pipe(
      map((response: any) => response?.identifiers),
      catchError((error) => of(error))
    );
  }
}
