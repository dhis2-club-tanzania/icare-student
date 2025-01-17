import { TestBed } from '@angular/core/testing';

import { DatasetReportsService } from './dataset-reports.service';

describe('DatasetReportsService', () => {
  let service: DatasetReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
