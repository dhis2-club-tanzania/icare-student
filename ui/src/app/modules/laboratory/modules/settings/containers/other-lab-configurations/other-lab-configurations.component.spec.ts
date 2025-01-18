import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherLabConfigurationsComponent } from './other-lab-configurations.component';

describe('OtherLabConfigurationsComponent', () => {
  let component: OtherLabConfigurationsComponent;
  let fixture: ComponentFixture<OtherLabConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherLabConfigurationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherLabConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
