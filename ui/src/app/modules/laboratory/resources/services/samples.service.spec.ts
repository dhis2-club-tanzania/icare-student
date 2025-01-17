import { TestBed } from '@angular/core/testing';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';

import { SamplesService } from './samples.service';

describe('SamplesService', () => {
  let service: SamplesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: OpenmrsHttpClientService, useValue: null }],
    });
    service = TestBed.inject(SamplesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
