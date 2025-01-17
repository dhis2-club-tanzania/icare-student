import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegesAndRolesComponent } from './privileges-and-roles.component';

describe('PrivilegesAndRolesComponent', () => {
  let component: PrivilegesAndRolesComponent;
  let fixture: ComponentFixture<PrivilegesAndRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivilegesAndRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegesAndRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
