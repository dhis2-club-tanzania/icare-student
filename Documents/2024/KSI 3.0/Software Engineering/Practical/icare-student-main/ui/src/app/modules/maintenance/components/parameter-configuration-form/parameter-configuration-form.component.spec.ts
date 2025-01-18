import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterConfigurationFormComponent } from './parameter-configuration-form.component';

describe('ParameterConfigurationFormComponent', () => {
  let component: ParameterConfigurationFormComponent;
  let fixture: ComponentFixture<ParameterConfigurationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterConfigurationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterConfigurationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
