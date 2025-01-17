import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUserProfileManagementComponent } from './shared-user-profile-management.component';

describe('SharedUserProfileManagementComponent', () => {
  let component: SharedUserProfileManagementComponent;
  let fixture: ComponentFixture<SharedUserProfileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedUserProfileManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedUserProfileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
