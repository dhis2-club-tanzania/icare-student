import { Injectable } from '@angular/core';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderTypeService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getAll(): Observable<any> {
    return this.httpClient.get('ordertype');
  }
}
