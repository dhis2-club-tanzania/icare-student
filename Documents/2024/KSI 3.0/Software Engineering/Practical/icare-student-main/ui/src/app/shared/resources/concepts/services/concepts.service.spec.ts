import { TestBed } from '@angular/core/testing';

import { ConceptsService } from './concepts.service';

describe('ConceptsService', () => {
  let service: ConceptsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConceptsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
