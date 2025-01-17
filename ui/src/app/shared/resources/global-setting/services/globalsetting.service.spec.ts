/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { GlobalSettingService } from './globalsetting.service';

describe('Service: Observation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalSettingService]
    });
  });

  it('should ...', inject([GlobalSettingService], (service: GlobalSettingService) => {
    expect(service).toBeTruthy();
  }));
});
