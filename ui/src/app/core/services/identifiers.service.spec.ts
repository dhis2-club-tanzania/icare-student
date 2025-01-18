import { TestBed } from '@angular/core/testing';

import { IdentifiersService } from './identifiers.service';

describe('IdentifiersService', () => {
  let service: IdentifiersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentifiersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
