/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { ReportService } from './report.service';

describe('Service: Report', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReportService,
        { provide: OpenmrsHttpClientService, useValue: null },
      ],
    });
  });

  it('should ...', inject([ReportService], (service: ReportService) => {
    expect(service).toBeTruthy();
  }));
});
