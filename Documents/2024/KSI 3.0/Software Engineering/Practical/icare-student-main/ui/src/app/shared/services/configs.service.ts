import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BASE_URL } from '../constants/constants.constants';
import { OpenmrsHttpClientService } from '../modules/openmrs-http-client/services/openmrs-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigsService {
  constructor(
    private httpClient: OpenmrsHttpClientService,
    private http: HttpClient
  ) {}

  getFacilityConfigs(): Observable<any> {
    return this.httpClient.get('systemsetting?q=dhis2.facility_details&v=full');
  }
  changePassword({ data }): Observable<any> {
    const url = 'password';
    return this.httpClient.post(url, data);
  }

  getLogo(): Observable<any> {
    return this.httpClient.get('systemsetting?q=icare.facility.logo&v=full');
  }

  getFacilityDetails(): Observable<any> {
    return this.httpClient.get('systemsetting?q=icare.facility.details&v=full');
  }
  
  generateCode(globalProperty: string, metadataType: string, count: number, digitCount: number): Observable<any> {
    return this.httpClient.get(`icare/codegen?globalProperty=${globalProperty}&metadataType=${metadataType}&count=${count}&digitCount=${digitCount}`)
    .pipe(
      map((response) => {
        return response
      }
    ),
    catchError((error) => error));
  }
}
