/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ObservationService } from './observation.service';

describe('Service: Observation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObservationService]
    });
  });

  it('should ...', inject([ObservationService], (service: ObservationService) => {
    expect(service).toBeTruthy();
  }));
});
