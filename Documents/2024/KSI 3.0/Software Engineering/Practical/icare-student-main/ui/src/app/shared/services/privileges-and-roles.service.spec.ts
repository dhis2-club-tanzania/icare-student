import { TestBed } from '@angular/core/testing';

import { PrivilegesAndRolesService } from './privileges-and-roles.service';

describe('PrivilegesAndRolesService', () => {
  let service: PrivilegesAndRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivilegesAndRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
