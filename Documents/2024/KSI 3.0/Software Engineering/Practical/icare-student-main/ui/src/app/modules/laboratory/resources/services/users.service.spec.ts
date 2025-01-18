import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { Api } from 'src/app/shared/resources/openmrs';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenmrsHttpClientService, useValue: null },
        { provide: Api, useValue: null },
      ],
    });
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
