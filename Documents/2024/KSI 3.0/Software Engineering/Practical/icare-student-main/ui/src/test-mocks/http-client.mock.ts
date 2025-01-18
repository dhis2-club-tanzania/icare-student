import { Observable, of } from 'rxjs';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';

export class HttpClientServiceMock {
  get(): Observable<any> {
    return of(null);
  }
}

export const httpClientServiceMock = {
  provide: OpenmrsHttpClientService,
  useClass: HttpClientServiceMock,
};
