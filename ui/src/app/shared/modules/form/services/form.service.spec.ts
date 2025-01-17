/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { FormService } from './form.service';

describe('Service: Form', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormService]
    });
  });

  it('should ...', inject([FormService], (service: FormService) => {
    expect(service).toBeTruthy();
  }));
});
