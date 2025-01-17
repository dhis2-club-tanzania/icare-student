import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLocationSettingsHomeComponent } from './shared-location-settings-home.component';

describe('SharedLocationSettingsHomeComponent', () => {
  let component: SharedLocationSettingsHomeComponent;
  let fixture: ComponentFixture<SharedLocationSettingsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLocationSettingsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLocationSettingsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
