import { TestBed } from '@angular/core/testing';

import { DatasetDefinitionsService } from './dataset-definitions.service';

describe('DatasetDefinitionsService', () => {
  let service: DatasetDefinitionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetDefinitionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
