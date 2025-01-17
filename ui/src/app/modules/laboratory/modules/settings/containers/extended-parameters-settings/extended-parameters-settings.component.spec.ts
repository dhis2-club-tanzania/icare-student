import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedParametersSettingsComponent } from './extended-parameters-settings.component';

describe('ExtendedParametersSettingsComponent', () => {
  let component: ExtendedParametersSettingsComponent;
  let fixture: ComponentFixture<ExtendedParametersSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedParametersSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedParametersSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
