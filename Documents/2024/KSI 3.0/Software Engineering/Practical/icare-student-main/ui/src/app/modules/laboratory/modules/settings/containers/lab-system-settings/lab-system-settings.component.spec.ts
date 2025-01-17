import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSystemSettingsComponent } from './lab-system-settings.component';

describe('LabSystemSettingsComponent', () => {
  let component: LabSystemSettingsComponent;
  let fixture: ComponentFixture<LabSystemSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabSystemSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSystemSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
