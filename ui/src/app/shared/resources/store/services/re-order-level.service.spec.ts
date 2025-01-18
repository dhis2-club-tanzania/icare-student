import { TestBed } from '@angular/core/testing';

import { ReOrderLevelService } from './re-order-level.service';

describe('ReOrderLevelService', () => {
  let service: ReOrderLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReOrderLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
