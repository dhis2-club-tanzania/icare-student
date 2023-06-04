import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Schedules } from './schedules.model';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  private baseURL = "http://localhost:8080/api/sms";

  constructor(private http: HttpClient) { }
  
  addSms(schedules: Schedules): Observable<Object>{
    return this.http.post(`${this.baseURL}`, schedules);
  
}
   // ...

getSchedules(): Observable<Schedules[]> {
  return this.http.get<Schedules[]>(`${this.baseURL}/get`);
}

}
