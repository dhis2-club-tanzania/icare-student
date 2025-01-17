/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { LocationGuard } from './location.guard';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('Guard: Location', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [LocationGuard, provideMockStore({})]
    });
  });

  it('should ...', inject([LocationGuard], (service: LocationGuard) => {
    expect(service).toBeTruthy();
  }));
});
