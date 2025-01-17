/* tslint:disable:no-unused-variable */

import { of } from 'rxjs';
import { IssuingObject } from '../models/issuing.model';
import { IssuingService } from './issuing.service';

const sampleIssues = [
  {
    creator: {
      display: 'Super User (admin)',
      uuid: '1010d442-e134-11de-babe-001e378eb67e',
    },
    requisitionItems: [
      {
        item: {
          display: 'bandage',
          uuid: '8o00d43570-8y37-11f3-1234-08002007777',
        },
        quantity: 20,
        requisition: {
          uuid: '782270d1-6cb9-45a9-96bf-963ad827b909',
        },
      },
    ],
    requestedLocation: {
      display: 'store A',
      uuid: '44939999-d333-fff2-9bff-61d11117c22e',
    },
    requestingLocation: {
      display: 'store B',
      uuid: '44938888-e444-ggg3-8aee-61d22227c22e',
    },
    created: '2020-11-05T12:34:42.000+0300',
    uuid: '782270d1-6cb9-45a9-96bf-963ad827b909',
    requisitionStatuses: [],
    issues: [
      {
        issueStatuses: [],
        creator: {
          display: 'Super User (admin)',
          uuid: '1010d442-e134-11de-babe-001e378eb67e',
        },
        issueingLocation: {
          display: 'store A',
          uuid: '44939999-d333-fff2-9bff-61d11117c22e',
        },
        issuedLocation: {
          display: 'store B',
          uuid: '44938888-e444-ggg3-8aee-61d22227c22e',
        },
        requisition: {
          creator: {
            display: 'Super User (admin)',
            uuid: '1010d442-e134-11de-babe-001e378eb67e',
          },
          requisitionItems: [
            {
              item: {
                display: 'bandage',
                uuid: '8o00d43570-8y37-11f3-1234-08002007777',
              },
              quantity: 20,
              requisition: {
                uuid: '0512c937-63fd-40c8-b706-74101bb40cbb',
              },
            },
          ],
          requestedLocation: {
            display: 'store A',
            uuid: '44939999-d333-fff2-9bff-61d11117c22e',
          },
          created: '2020-11-05T14:44:08.000+0300',
          requestingLocation: {
            display: 'store B',
            uuid: '44938888-e444-ggg3-8aee-61d22227c22e',
          },
          uuid: '0512c937-63fd-40c8-b706-74101bb40cbb',
          requisitionStatuses: [],
          issues: [],
        },
        issueItems: [
          {
            item: {
              display: 'bandage',
              uuid: '8o00d43570-8y37-11f3-1234-08002007777',
            },
            quantity: 20,
            issue: {
              uuid: '33ca0437-b54a-4e64-8570-ce1d55c9a107',
            },
          },
        ],
        created: '2020-11-05T14:44:08.000+0300',
        uuid: '33ca0437-b54a-4e64-8570-ce1d55c9a107',
      },
    ],
  },
];

describe('Given issuing list', () => {
  let httpClientSpy: {
    get: jasmine.Spy;
  };
  let issuingService: IssuingService;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('NgxOpenmrsHttpclientServiceService', [
      'get',
    ]);

    httpClientSpy.get.and.returnValue(of(sampleIssues));

    issuingService = new IssuingService(httpClientSpy as any);
  });

  it('should return sanitized issue list', () => {
    issuingService.getAllIssuings().subscribe((issues: IssuingObject[]) => {
      const issuing = issues[0];

      expect(issuing.id).toEqual(sampleIssues[0].uuid);
      expect(issuing.requisitionUuid).toEqual(sampleIssues[0]?.uuid);
      expect(issuing.itemUuid).toEqual(
        sampleIssues[0].requisitionItems[0]?.item?.uuid
      );
      expect(issuing.name).toEqual(
        sampleIssues[0].requisitionItems[0].item.display
      );
      expect(issuing.quantityRequested).toEqual(
        sampleIssues[0].requisitionItems[0].quantity
      );
      expect(issuing.quantityIssued).toEqual(
        sampleIssues[0].issues[0].issueItems[0].quantity
      );
      expect(issuing.quantityRequested).toEqual(
        sampleIssues[0].requisitionItems[0].quantity
      );
      expect(issuing.requestingLocation.name).toEqual(
        sampleIssues[0].requestingLocation.display
      );
      expect(issuing.requestedLocation.name).toEqual(
        sampleIssues[0].requestedLocation.display
      );
      expect(issuing.status).toEqual('ISSUED');
      expect(issuing.remarks).toEqual('');
    });
  });
});
