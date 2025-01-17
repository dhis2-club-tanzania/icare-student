import { Injectable } from "@angular/core";

import * as _ from "lodash";
import { HttpClient } from "@angular/common/http";
import { from, Observable, of } from "rxjs";
import { BASE_URL } from "../constants/constants.constants";
import { OpenmrsHttpClientService } from "../modules/openmrs-http-client/services/openmrs-http-client.service";
import { catchError, map } from "rxjs/operators";
import { Api } from "../resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  constructor(
    private httpClient: HttpClient,
    private openMRSHttpClient: OpenmrsHttpClientService,
    private API: Api
  ) {}

  getPatientsDetails(id): Observable<any> {
    return this.httpClient.get(BASE_URL + "patient/" + id + "?v=full");
  }

  getPatientPhone(patientUuid) {
    return this.openMRSHttpClient
      .get(
        `reportingrest/dataSet/15cfe953-1a62-4fc7-8ccc-d2b6351406f2?patientUuid=${patientUuid}`
      )
      .pipe(
        map((response) => {
          return response?.rows.map((row) => row?.value).join(", ") || [];
        }),
        catchError((error) => of(error))
      );
  }

  getPatientObservations(parameters): Observable<any> {
    return this.openMRSHttpClient.get(
      `obs?patient=${parameters?.patientUuid}&v=custom:(encounter:(visit,location:(uuid,display),obs:(uuid,display,obsDatetime,concept:(display),groupMembers:(uuid,display,concept,value,groupMembers:(uuid,concept:(display),value)))))&concept=${parameters?.conceptUuid}`
    );
  }

  getAllPatientsObses(parameters): Observable<any> {
    return from(this.API.obs.getAllObses(parameters));
  }
  getPatientSummary() {
    return this.openMRSHttpClient.get("icare/summary").pipe(
      map((response) => {
        return {
          ...response,
          locations: response?.locations?.filter(
            (location) =>
              (
                location?.tags?.filter(
                  (tag) => tag?.name === "Treatment Room"
                ) || []
              )?.length > 0
          ),
        };
      })
    );
  }
}
