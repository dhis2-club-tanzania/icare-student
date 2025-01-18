import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementDashboardComponent } from './user-management-dashboard.component';

describe('UserManagementDashboardComponent', () => {
  let component: UserManagementDashboardComponent;
  let fixture: ComponentFixture<UserManagementDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManagementDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
