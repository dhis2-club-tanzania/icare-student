import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSettingsListComponent } from './time-settings-list.component';

describe('TimeSettingsListComponent', () => {
  let component: TimeSettingsListComponent;
  let fixture: ComponentFixture<TimeSettingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeSettingsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
