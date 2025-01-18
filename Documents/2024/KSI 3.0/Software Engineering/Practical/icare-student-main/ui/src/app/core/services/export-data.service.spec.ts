import { TestBed } from '@angular/core/testing';

import { ExportDataService } from './export-data.service';

describe('ExportDataService', () => {
  let service: ExportDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
