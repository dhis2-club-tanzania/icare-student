import { Injectable } from "@angular/core";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "../../../modules/openmrs-http-client/services/openmrs-http-client.service";
import { omit } from "lodash";
import { Api, DrugCreate, DrugGet, EncounterCreate } from "../../openmrs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DrugsService {
  constructor(
    private openMRSHttpClient: OpenmrsHttpClientService,
    private API: Api
  ) {}

  getDrugsUsingConceptUuid(conceptUuid): Observable<any> {
    return this.openMRSHttpClient.get(`icare/drug?concept=${conceptUuid}`).pipe(
      map((response) => {
        return response;
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of(errorResponse?.error);
      })
    );
  }

  getDrug(id): Observable<any> {
    return this.openMRSHttpClient.get(`drug/${id}`).pipe(
      map((response) => {
        return response;
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of(errorResponse?.error);
      })
    );
  }

  getAllDrugs(params: {
    limit?: number;
    startIndex?: number;
    q?: string;
    v?: any;
    code?: string;
    source?: string;
  }): Observable<DrugGet[]> {
    return from(this.API.drug.getAllDrugs(params)).pipe(
      map((response) => response),
      catchError((error) => of(error))
    );
  }

  createDrug(data: any): Observable<DrugGet> {
    return from(this.API.drug.createDrug(data)).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }

  updateDrug(uuid: string, data: any): Observable<DrugGet> {
    return from(this.API.drug.updateDrug(uuid, data)).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => of(error))
    );
  }
}
