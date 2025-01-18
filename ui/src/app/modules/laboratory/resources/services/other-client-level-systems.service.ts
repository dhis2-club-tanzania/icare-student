import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";

@Injectable({
  providedIn: "root",
})
export class OtherClientLevelSystemsService {
  constructor(private httpClientService: OpenmrsHttpClientService) {}

  getClientsFromOtherSystems(parameters: {
    identifier: string;
    identifierReference: string;
    labTestRequestProgramStageId: string;
  }): Observable<any> {
    return this.httpClientService
      .get(
        `icare/client/externalsystems?identifier=${parameters?.identifier}&identifierReference=${parameters?.identifierReference}`
      )
      .pipe(
        map((response) => {
          return response?.map((responseItem) => {
            return {
              ...responseItem,
              hasLabRequest:
                response?.events?.length > 0
                  ? (
                      response?.events?.filter(
                        (event) =>
                          parameters?.labTestRequestProgramStageId &&
                          event?.programStage ==
                            parameters?.labTestRequestProgramStageId
                      ) || []
                    )?.length > 0
                  : false,
            };
          });
        })
      );
  }

  sendLabRequest(data: any): Observable<any> {
    return this.httpClientService
      .post(`icare/externalsystems/labrequest`, data)
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }

  sendLabResult(data: any): Observable<any> {
    return this.httpClientService
      .post(`icare/externalsystems/labresult`, data)
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }

  verifyCredentials(data: any): Observable<any> {
    return this.httpClientService
      .get(
        `icare/externalsystems/verifycredentials?username=${data?.username}&password=${data?.password}&systemKey=${data?.systemKey}`
      )
      .pipe(
        map((response) => response),
        catchError((error) => of(error))
      );
  }
}
