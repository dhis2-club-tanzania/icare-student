import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedManageUserComponent } from './shared-manage-user.component';

describe('SharedManageUserComponent', () => {
  let component: SharedManageUserComponent;
  let fixture: ComponentFixture<SharedManageUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedManageUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedManageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
