import { TestBed, inject } from '@angular/core/testing';

import { DrugOrdersService } from './drug-orders.service';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';

describe('DrugOrdersService', () => {
  let service: DrugOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: OpenmrsHttpClientService, useValue: null }],
    });
    service = TestBed.inject(DrugOrdersService);
  });

  it('should ...', inject([DrugOrdersService], (service: DrugOrdersService) => {
    expect(service).toBeTruthy();
  }));
});
