import { Injectable } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { OpenmrsHttpClientService } from "src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service";
import {
  Api,
  ProgramenrollmentGetFull,
} from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class ProgramsService {
  constructor(private httpClient: OpenmrsHttpClientService, private api: Api) {}

  getPatientsEnrollments(parameters: string[]): Observable<any[]> {
    return this.httpClient
      .get(`icare/patientprogramenrollment?${parameters.join("&")}`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => of(error))
      );
  }

  getPatientEnrollmentDetails(
    uuid: string
  ): Observable<ProgramenrollmentGetFull> {
    return this.httpClient.get(`programenrollment/${uuid}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => of(error))
    );
  }

  getEnrollmentsByPatient(
    patientUuid: string,
    startIndex?: string,
    limit?: string
  ): Observable<any> {
    // const url = `programenrollment?patient=${patientUuid}&v=full`;
    const url = `icare/patientprogramenrollment?patient=${patientUuid}`;
    return this.httpClient.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => of(error))
    );
  }

  getAllPrograms(parameters?: string[]): Observable<any[]> {
    const url = `program?${parameters ? parameters?.join("&") : ""}`;

    return this.httpClient.get(url).pipe(
      map((response: any) => {
        return response?.results || [];
      }),
      catchError((error: any) => of(error))
    );
  }

  newEnrollment(patientId, payload) {
    const url = `programenrollment/`;

    return this.httpClient.post(url, payload).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => of(error))
    );
  }

  createPatientWorkflowState(
    data: any,
    enrollmentUuid: string
  ): Observable<any> {
    return this.httpClient
      .post(`programenrollment/${enrollmentUuid}`, data)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => of(error))
      );
  }

  createEncounterPatientState(data: any): Observable<any> {
    return this.httpClient.post(`icare/encounterpatientstate`, data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => of(error))
    );
  }

  createEncounterProgram(data: any): Observable<any> {
    return this.httpClient.post(`icare/encounterpatientprogram`, data).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: any) => of(error))
    );
  }

  getPatientStateEncounterDetails(patientStateUuid: string): Observable<any> {
    return this.httpClient
      .get(`icare/encounterpatientstate/${patientStateUuid}`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => of(error))
      );
  }

  getProgramEncounterDetails(enrollmentUuid: string): Observable<any> {
    return this.httpClient
      .get(`icare/encounterpatientprogram/${enrollmentUuid}`)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => of(error))
      );
  }
}
