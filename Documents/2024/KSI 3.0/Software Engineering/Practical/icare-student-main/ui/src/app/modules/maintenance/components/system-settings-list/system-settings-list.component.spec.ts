import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsListComponent } from './system-settings-list.component';

describe('SystemSettingsListComponent', () => {
  let component: SystemSettingsListComponent;
  let fixture: ComponentFixture<SystemSettingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemSettingsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
