/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { PaymentTypeService } from './payment-type.service';

describe('Service: PaymentType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentTypeService]
    });
  });

  it('should ...', inject([PaymentTypeService], (service: PaymentTypeService) => {
    expect(service).toBeTruthy();
  }));
});
