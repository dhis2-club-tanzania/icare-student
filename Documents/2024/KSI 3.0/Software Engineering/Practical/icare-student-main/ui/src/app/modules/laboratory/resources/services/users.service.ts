import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { Api, UserGet, UserGetFull } from 'src/app/shared/resources/openmrs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private api: Api, private httpClient: OpenmrsHttpClientService) {}

  getUsers(): Observable<any> {
    return from(
      this.httpClient.get(
        'user?v=custom:(uuid,display,username,person:(uuid,display))'
      )
    );
  }
}
