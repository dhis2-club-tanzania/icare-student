import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUserManagementComponent } from './store-user-management.component';

describe('StoreUserManagementComponent', () => {
  let component: StoreUserManagementComponent;
  let fixture: ComponentFixture<StoreUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreUserManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
