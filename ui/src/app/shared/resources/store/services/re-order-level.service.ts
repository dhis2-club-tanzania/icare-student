import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class ReOrderLevelService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getReOrderLevelOfItems(locationUuid?: string): Observable<any[]> {
    return this.httpClient.get(`store/reorderlevels`).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  createReOrderLevelOfAnItem(data): Observable<any[]> {
    return this.httpClient.post(`store/reorderlevel`, data).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  updateReOrderLevel(reOrderLevelUuid: string, reOrderLevel: any): Observable<any>{
    return this.httpClient.post(`store/reorderlevel/${reOrderLevelUuid}`, reOrderLevel).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }
}
