import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSettingsComponent } from './reports-settings.component';

describe('ReportsSettingsComponent', () => {
  let component: ReportsSettingsComponent;
  let fixture: ComponentFixture<ReportsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
