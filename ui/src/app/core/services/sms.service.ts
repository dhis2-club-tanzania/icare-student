import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class SmsService {
  constructor(private httpClientService: OpenmrsHttpClientService) {}

  uploadMessages(data): Observable<any> {
    return this.httpClientService.post("icare/messages", data).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
