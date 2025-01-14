import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsOfMeasureSettingsComponent } from './units-of-measure-settings.component';

describe('UnitsOfMeasureSettingsComponent', () => {
  let component: UnitsOfMeasureSettingsComponent;
  let fixture: ComponentFixture<UnitsOfMeasureSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsOfMeasureSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsOfMeasureSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
