import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLocationSettingsComponent } from './shared-location-settings.component';

describe('SharedLocationSettingsComponent', () => {
  let component: SharedLocationSettingsComponent;
  let fixture: ComponentFixture<SharedLocationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLocationSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLocationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
