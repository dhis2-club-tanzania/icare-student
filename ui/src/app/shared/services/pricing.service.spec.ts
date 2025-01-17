/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { PricingService } from './pricing.service';

describe('Service: Pricing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PricingService,
        { provide: OpenmrsHttpClientService, useValue: null },
      ],
    });
  });

  it('should ...', inject([PricingService], (service: PricingService) => {
    expect(service).toBeTruthy();
  }));
});
