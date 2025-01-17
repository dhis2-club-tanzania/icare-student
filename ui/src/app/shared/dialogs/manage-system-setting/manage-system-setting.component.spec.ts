import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSystemSettingComponent } from './manage-system-setting.component';

describe('ManageSystemSettingComponent', () => {
  let component: ManageSystemSettingComponent;
  let fixture: ComponentFixture<ManageSystemSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSystemSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSystemSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
