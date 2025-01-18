import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePrivilegesComponent } from './manage-privileges.component';

describe('ManagePrivilegesComponent', () => {
  let component: ManagePrivilegesComponent;
  let fixture: ComponentFixture<ManagePrivilegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePrivilegesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePrivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
