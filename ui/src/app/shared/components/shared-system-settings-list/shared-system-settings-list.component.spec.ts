import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSystemSettingsListComponent } from './shared-system-settings-list.component';

describe('SharedSystemSettingsListComponent', () => {
  let component: SharedSystemSettingsListComponent;
  let fixture: ComponentFixture<SharedSystemSettingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSystemSettingsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSystemSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
