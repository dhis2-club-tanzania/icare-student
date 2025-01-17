/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { LedgerTypeService } from './ledger-type.service';

describe('Service: LedgerType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LedgerTypeService]
    });
  });

  it('should ...', inject([LedgerTypeService], (service: LedgerTypeService) => {
    expect(service).toBeTruthy();
  }));
});
