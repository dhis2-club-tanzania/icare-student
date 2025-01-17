import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { OpenmrsHttpClientService } from "../../../modules/openmrs-http-client/services/openmrs-http-client.service";
import { Patient } from "../models/patient.model";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getPatients(searchTerm: string): Observable<any> {
    return of(searchTerm).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((term) => this.searchPatients(term))
    );
  }

  getPatient(patientUuid: string): Observable<Patient> {
    return this.httpClient
      .get(`patient/${patientUuid}?v=full`)
      .pipe(map((patientResponse: any) => new Patient(patientResponse)));
  }

  searchPatients(searchTerm): Observable<Patient[]> {
    const url = `patient?identifier=${searchTerm}&v=full&limit=10`;
    return this.httpClient.get(url).pipe(
      map((res: any) =>
        (res?.results || []).map((patient) => new Patient(patient))
      ),
      catchError((e) => of(e))
    );
  }

  getPersonDetails(personUuid): Observable<any> {
    return this.httpClient.get(`person/${personUuid}?v=full`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
