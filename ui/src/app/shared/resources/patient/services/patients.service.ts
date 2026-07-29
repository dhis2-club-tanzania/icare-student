import { Injectable } from "@angular/core";
import { Observable, from, of } from "rxjs";
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
import { Api, PersonattributetypeGetFull } from "../../openmrs";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  constructor(private httpClient: OpenmrsHttpClientService, private API: Api) {}

  // Updated method to include pagination support (pageSize, currentPage)
  getPatients(searchTerm: string, pageSize: number, currentPage: number): Observable<any> {
    return of(searchTerm).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((term) => this.searchPatients(term, pageSize, currentPage))
    );
  }

  // Fetch individual patient details
  getPatient(patientUuid: string): Observable<Patient> {
    return this.httpClient
      .get(`patient/${patientUuid}?v=full`)
      .pipe(map((patientResponse: any) => new Patient(patientResponse)));
  }

  // Updated search method to handle pagination
  searchPatients(searchTerm: string, pageSize: number, currentPage: number): Observable<Patient[]> {
    const startIndex = currentPage * pageSize; // Calculate the start index based on the current page
    const url = `patient?identifier=${searchTerm}&v=full&limit=${pageSize}&startIndex=${startIndex}`;
    
    return this.httpClient.get(url).pipe(
      map((res: any) =>
        (res?.results || []).map((patient) => new Patient(patient))
      ),
      catchError((e) => of(e))
    );
  }

  // Get person details by UUID
  getPersonDetails(personUuid: string): Observable<any> {
    return this.httpClient.get(`person/${personUuid}?v=full`).pipe(
      map((response) => response),
      catchError((e) => of(e))
    );
  }

  // Create a new patient record
  createPatient(data: any): Observable<any> {
    return this.httpClient.post(`patient`, data).pipe(
      map((response) => response),
      catchError((e) => of(e))
    );
  }

  // Fetch person attribute types
  getPersonAttributeTypes(): Observable<PersonattributetypeGetFull[]> {
    return from(this.API.personattributetype.getAllPersonAttributeTypes()).pipe(
      map(
        (response: any) =>
          response?.results?.filter(
            (attributeType: PersonattributetypeGetFull) =>
              !attributeType?.retired
          ) || []
      ),
      catchError((e) => of(e))
    );
  }
}
