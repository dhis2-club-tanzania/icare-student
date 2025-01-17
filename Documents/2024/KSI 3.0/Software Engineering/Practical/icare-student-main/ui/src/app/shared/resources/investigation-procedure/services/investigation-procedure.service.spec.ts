import { TestBed } from '@angular/core/testing';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';

import { InvestigationProcedureService } from './investigation-procedure.service';

describe('InvestigationProcedureService', () => {
  let service: InvestigationProcedureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: OpenmrsHttpClientService, useValue: null }],
    });
    service = TestBed.inject(InvestigationProcedureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
