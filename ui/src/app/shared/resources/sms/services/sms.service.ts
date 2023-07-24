import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class SmsService {
    baseUrl = 'http://localhost:8080'
    constructor(private httpClient: HttpClient) { }

    sendSms(smsPayload: { patientPhoneNo: string, message: string }) {
        const payload = { "phoneNumber": smsPayload.patientPhoneNo, "message": smsPayload.message }
        return this.httpClient.post(`${this.baseUrl}/api/send/single`, payload).pipe(
            map((response) => {
                return response;
            })
        );
    }

    scheduleSms(smsPayload: { patientPhoneNo: string, message: string, date: string, time: string }) {
        const payload = {
            "phoneNumber": smsPayload.patientPhoneNo,
            "message": smsPayload.message,
            "date": smsPayload.date,
            "time": smsPayload.time
        }
        return this.httpClient.post(`${this.baseUrl}/api/schedule/single`, payload).pipe(
            map((response) => {
                return response;
            })
        );
    }


}