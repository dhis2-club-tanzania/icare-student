import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabConfigurationsComponent } from './lab-configurations.component';

describe('LabConfigurationsComponent', () => {
  let component: LabConfigurationsComponent;
  let fixture: ComponentFixture<LabConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabConfigurationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
