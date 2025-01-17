import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserProfileModalComponent } from './manage-user-profile-modal.component';

describe('ManageUserProfileModalComponent', () => {
  let component: ManageUserProfileModalComponent;
  let fixture: ComponentFixture<ManageUserProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserProfileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
