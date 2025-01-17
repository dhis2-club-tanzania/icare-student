/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { ConsultationService } from './consultation.service';

describe('Service: Consultation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultationService]
    });
  });

  it('should ...', inject([ConsultationService], (service: ConsultationService) => {
    expect(service).toBeTruthy();
  }));
});
