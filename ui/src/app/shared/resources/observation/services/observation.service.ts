import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
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
    const endpoint = data?.encounterUuid
      ? `encounter/${data.encounterUuid}`
      : "encounter";

    return this.httpClient
      .post(
        endpoint,
        data?.encounterUuid
          ? {
              obs: data["obs"],
            }
          : data
      )
      .pipe(
        tap((response) => {
          return response;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  // saveObservationsViaEncounter(data): Observable<any> {
  //   return data?.encounterType
  //     ? this.httpClient
  //         .post("encounter/" + data?.encounterType, data)
  //         .pipe(
  //           map((response) => {
  //             return response
  //           }),
  //           catchError((error) => {
  //             console.log("error --------------------------",error)
  //             return error
  //           })
  //         )
  //     : this.httpClient.post(`encounter`, data).pipe(
  //         map((response) => {
  //           return response

  //         }),
  //         catchError((error) => {
  //           return of(error)
  //         })
  //       );
  // }
  // i removed this object on data sent seems body was wrong accoding to  creating encounter api
  // {
  // obs: data["obs"],
  // }

  saveEncounterWithObsDetails(data): Observable<any> {
    return this.httpClient.post("encounter", omit(data, "fileObs")).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  saveEncounterWithObsAndOrdersDetails(
    data,
    shouldReturnOrderPayloadWithConcept?: boolean
  ): Observable<any> {
    return !shouldReturnOrderPayloadWithConcept
      ? this.httpClient.post("encounter", omit(data, "fileObs")).pipe(
          map((response) => response),
          catchError((error) => of(error))
        )
      : this.httpClient.post("encounter", omit(data, "fileObs")).pipe(
          switchMap((response: any) =>
            zip(
              ...response?.orders.map((order: any) =>
                this.httpClient.get(
                  `orders/${order?.uuid}?v=custom:(uuid,display,concept:(uuid,display))`
                )
              )
            ).pipe(
              map((orders: any[]) => {
                return {
                  ...response,
                  orders,
                };
              })
            )
          )
        );
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
              // console.log("FILEresponse", response);
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
