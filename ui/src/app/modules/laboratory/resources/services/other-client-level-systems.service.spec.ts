import { TestBed } from '@angular/core/testing';

import { OtherClientLevelSystemsService } from './other-client-level-systems.service';

describe('OtherClientLevelSystemsService', () => {
  let service: OtherClientLevelSystemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherClientLevelSystemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
