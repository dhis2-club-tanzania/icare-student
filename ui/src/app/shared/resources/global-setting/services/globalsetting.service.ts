import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api, ObsCreate, ObsGetFull, ObsUpdate } from "../../openmrs";

import { omit } from "lodash";
import { HttpClient } from "@angular/common/http";
import { Observation } from "../../observation/models/observation.model";

@Injectable({
  providedIn: "root",
})
export class GlobalSettingService {
  constructor(
    private api: Api,
    private httpClient: OpenmrsHttpClientService,
    private http: HttpClient
  ) {}


  getSpecificGlobalProperties(uuid: string): Observable<any> {
    const endpoint = `systemsetting/${uuid}`;
    return this.httpClient.get(endpoint).pipe(
      map((response: any) => {
        return response; 
      }),
      catchError((error) => {
        console.error("Failed to fetch global property:", error);
        return of(null); 
      })
    );
  }
  
  
}
