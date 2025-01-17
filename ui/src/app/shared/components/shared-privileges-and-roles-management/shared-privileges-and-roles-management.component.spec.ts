import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPrivilegesAndRolesManagementComponent } from './shared-privileges-and-roles-management.component';

describe('SharedPrivilegesAndRolesManagementComponent', () => {
  let component: SharedPrivilegesAndRolesManagementComponent;
  let fixture: ComponentFixture<SharedPrivilegesAndRolesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedPrivilegesAndRolesManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPrivilegesAndRolesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
