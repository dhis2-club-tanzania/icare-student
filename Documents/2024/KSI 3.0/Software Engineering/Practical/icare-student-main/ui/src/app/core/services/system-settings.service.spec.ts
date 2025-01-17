import { TestBed } from '@angular/core/testing';

import { SystemSettingsService } from './system-settings.service';

describe('SystemSettingsService', () => {
  let service: SystemSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
