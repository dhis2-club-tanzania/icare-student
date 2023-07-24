import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Api } from "src/app/shared/resources/openmrs";
import { Observable, from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ClinicService {
  constructor(private api: Api) {}
  
  createAppointment(appointmentPayload: any): Observable<any> {
    return from(this.api.appointmentscheduling.createAppointment(appointmentPayload)).pipe(
        map((response) => {
          return response?.results;
        }))
  }
}
