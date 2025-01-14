import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUserManagementDashboardComponent } from './store-user-management-dashboard.component';

describe('StoreUserManagementDashboardComponent', () => {
  let component: StoreUserManagementDashboardComponent;
  let fixture: ComponentFixture<StoreUserManagementDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreUserManagementDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreUserManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
