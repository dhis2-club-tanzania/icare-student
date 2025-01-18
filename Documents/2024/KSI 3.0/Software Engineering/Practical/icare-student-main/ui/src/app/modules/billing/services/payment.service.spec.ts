/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { PaymentService } from './payment.service';

describe('Service: Payment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentService,
        { provide: OpenmrsHttpClientService, useValue: null },
      ],
    });
  });

  it('should ...', inject([PaymentService], (service: PaymentService) => {
    expect(service).toBeTruthy();
  }));
});
