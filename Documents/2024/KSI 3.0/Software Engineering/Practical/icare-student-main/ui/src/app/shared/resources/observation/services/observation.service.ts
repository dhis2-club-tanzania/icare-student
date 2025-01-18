import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import { Api, ObsCreate, ObsGetFull, ObsUpdate } from "../../openmrs";
import { Observation } from "../models/observation.model";

import { omit } from "lodash";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ObservationService {
  constructor(
    private api: Api,
    private httpClient: OpenmrsHttpClientService,
    private http: HttpClient
  ) {}

  create(observation: ObsCreate): Observable<Observation> {
    return from(this.api.obs.createObs(observation)).pipe(
      map((observationResponse) => new Observation(observationResponse))
    );
  }

  update(observation: ObsUpdate): Observable<Observation> {
    return from(this.api.obs.updateObs(observation.uuid, observation)).pipe(
      map((res) => {
        return res;
      })
    );
  }

  saveMany(observations: ObsCreate[] | ObsUpdate[]): Observable<Observation[]> {
    return zip(
      ...(observations || []).map((observation) => {
        // TODO: Add logic for updating observations
        return this.create(observation);
      })
    );
  }

  saveObservationsViaEncounter(data): Observable<any> {
    return data?.encounterUuid
      ? this.httpClient
          .post("encounter/" + data?.encounterUuid, {
            obs: data["obs"],
          })
          .pipe(
            map((response) => response),
            catchError((error) => error)
          )
      : this.httpClient.post(`encounter`, data).pipe(
          map((response) => response),
          catchError((error) => error)
        );
  }

  saveEncounterWithObsDetails(data): Observable<any> {
    return this.httpClient.post("encounter", omit(data, "fileObs"));
  }

  saveObsDetailsForFiles(data): Observable<any> {
    return zip(
      ...data?.map((obsItem) => {
        let formData = new FormData();
        const jsonData = omit(obsItem, "file");
        formData.append("json", JSON.stringify(jsonData));
        formData.append("file", obsItem?.file);
        // TODO: Find a way to save using the custom httpClientService module
        return this.http
          .post(` ../../../openmrs/ws/rest/v1/obs`, formData)
          .pipe(
            map((response) => {
              console.log("FILEresponse", response);
              return response;
            })
          );
      })
    ).pipe(map((response) => response));
  }

  getObservationsByPatientUuid(patientUuid: string): Observable<ObsGetFull[]> {
    return this.httpClient.get(`obs?patient=${patientUuid}`);
  }
}
