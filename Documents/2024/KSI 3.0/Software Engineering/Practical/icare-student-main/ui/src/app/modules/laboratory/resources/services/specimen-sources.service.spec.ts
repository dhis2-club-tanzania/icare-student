import { TestBed } from '@angular/core/testing';

import { SpecimenSourcesService } from './specimen-sources.service';

describe('SpecimenSourcesService', () => {
  let service: SpecimenSourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecimenSourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
