/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { OpenmrsHttpClientService } from '../../shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { AuthService } from './auth.service';

describe('Service: Auth', () => {
  let httpClientSpy: {
    login: jasmine.Spy;
  };
  let currentUserSpy: {
    get: jasmine.Spy;
  };
  let authService: AuthService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('NgxOpenmrsHttpclientServiceService', [
      'login',
    ]);

    currentUserSpy = jasmine.createSpyObj('CurrentUserDetailsService', ['get']);

    authService = new AuthService(httpClientSpy as any, currentUserSpy as any);
  });

  it('should report auth service instance', () => {
    expect(authService).toBeDefined();
  });

  it('should return authenticated user details when valid token is supplied', () => {
    const authorizedResponse = {
      sessionId: 'D5D8E4F027E34518E450FDE582052343',
      authenticated: true,
      user: {
        uuid: '1177aae8-1902-11eb-971e-0242ac1b0003',
        display: 'admin',
        username: 'admin',
        systemId: 'admin',
        userProperties: {
          loginAttempts: '0',
          locations:
            "['e08a7f79-665a-4934-b98a-339f2a6ff3ee', 'iCARE002-645f-451f-8efe-a0db56f09676', 'iCARE003-645f-451f-8efe-a0db56f09676', 'iCARE004-645f-451f-8efe-a0db56f09676', 'b1a8b05e-3542-4037-bbd3-998ee9c40574', '7fdfa2cb-bc95-405a-88c6-32b7673c0453']",
        },
        person: { uuid: '02369824-1902-11eb-971e-0242ac1b0003' },
        privileges: [],
        roles: [
          {
            uuid: '8d94f852-c2cc-11de-8d13-0010c6dffd0f',
            name: 'System Developer',
          },
          { uuid: '8d94f280-c2cc-11de-8d13-0010c6dffd0f', name: 'Provider' },
        ],
      },
      locale: 'en_GB',
      allowedLocales: ['en', 'en_GB', 'es', 'fr', 'it', 'pt'],
      sessionLocation: null,
    };

    httpClientSpy.login.and.returnValue(of(authorizedResponse));
    currentUserSpy.get.and.returnValue(
      of({
        uuid: '1177aae8-1902-11eb-971e-0242ac1b0003',
        display: 'admin',
        username: 'admin',
        systemId: 'admin',
        userProperties: {
          loginAttempts: '0',
          locations:
            "['e08a7f79-665a-4934-b98a-339f2a6ff3ee', 'iCARE002-645f-451f-8efe-a0db56f09676', 'iCARE003-645f-451f-8efe-a0db56f09676', 'iCARE004-645f-451f-8efe-a0db56f09676', 'b1a8b05e-3542-4037-bbd3-998ee9c40574', '7fdfa2cb-bc95-405a-88c6-32b7673c0453']",
        },
        person: { uuid: '02369824-1902-11eb-971e-0242ac1b0003' },
        privileges: [],
        roles: [
          {
            uuid: '8d94f852-c2cc-11de-8d13-0010c6dffd0f',
            name: 'System Developer',
          },
          { uuid: '8d94f280-c2cc-11de-8d13-0010c6dffd0f', name: 'Provider' },
        ],
      })
    );

    authService.login('token').subscribe((response) => {
      expect(response?.authenticated).toBeTruthy();
      expect(response?.userLocations).toEqual([
        'e08a7f79-665a-4934-b98a-339f2a6ff3ee',
        'iCARE002-645f-451f-8efe-a0db56f09676',
        'iCARE003-645f-451f-8efe-a0db56f09676',
        'iCARE004-645f-451f-8efe-a0db56f09676',
        'b1a8b05e-3542-4037-bbd3-998ee9c40574',
        '7fdfa2cb-bc95-405a-88c6-32b7673c0453',
      ]);
    });
  });

  it('should return authenticated user details when invalid token is supplied', () => {
    const authorizedResponse = {
      authenticated: false,
      locale: 'en_GB',
      allowedLocales: ['en', 'en_GB', 'es', 'fr', 'it', 'pt'],
      sessionLocation: null,
    };

    httpClientSpy.login.and.returnValue(of(authorizedResponse));

    authService.login('token').subscribe((response) => {
      expect(response?.authenticated).toBeFalsy();
    });
  });
});
