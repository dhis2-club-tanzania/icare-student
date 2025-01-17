import { TestBed } from '@angular/core/testing';

import { AdditionalFieldsService } from './additional-fields.service';

describe('AdditionalFieldsService', () => {
  let service: AdditionalFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditionalFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
