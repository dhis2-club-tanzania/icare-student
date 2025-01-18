/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { ItemPriceService } from './item-price.service';

describe('Service: ItemPrice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemPriceService,
        { provide: OpenmrsHttpClientService, useValue: null },
      ],
    });
  });

  it('should ...', inject([ItemPriceService], (service: ItemPriceService) => {
    expect(service).toBeTruthy();
  }));
});
