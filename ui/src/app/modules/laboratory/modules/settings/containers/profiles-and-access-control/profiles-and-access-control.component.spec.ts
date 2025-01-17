import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesAndAccessControlComponent } from './profiles-and-access-control.component';

describe('ProfilesAndAccessControlComponent', () => {
  let component: ProfilesAndAccessControlComponent;
  let fixture: ComponentFixture<ProfilesAndAccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilesAndAccessControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesAndAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
