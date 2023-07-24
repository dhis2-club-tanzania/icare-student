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
import { Appointment } from "../models/appointment.model";
import { Api, FormGet } from "src/app/shared/resources/openmrs";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  constructor(private httpClient: OpenmrsHttpClientService,private api: Api,) {}

  getAppointments(searchTerm: string): Observable<any> {
    return of(searchTerm).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((term) => this.searchAppointments(term))
    );
  }

  getAppointment(appointmentUuid: string): Observable<Appointment> {
    return this.httpClient
      .get(`appointmentscheduling/appointment/${appointmentUuid}?v=full`)
      .pipe(map((appointmentResponse: any) => new Appointment(appointmentResponse)));
  }

  searchAppointments(searchTerm): Observable<Appointment[]> {
    const url = `appointmentscheduling/appointment?identifier=${searchTerm}&v=full&limit=10`;
    return this.httpClient.get(url).pipe(
      map((res: any) =>
        (res?.results || []).map((appointment) => new Appointment(appointment))
      ),
      catchError((e) => of(e))
    );
  }

  getAppointmentDetails(appointmentUuid): Observable<any> {
    return this.httpClient.get(`person/${appointmentUuid}?v=full`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getAppointmentType(searchTerm) {
    const url = `/appointmentscheduling/appointmenttype${searchTerm}`
    return this.httpClient.get(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createTimeSlot(payload) {
    const url = `/appointmentscheduling/timeslot`
    return this.httpClient.post(url, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  filterAppointments(payload) {
    return from(
      this.api.appointmentscheduling.getAllAppointments(payload)
    ).pipe(
      map((response) => {
        console.log(response)
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }
}
