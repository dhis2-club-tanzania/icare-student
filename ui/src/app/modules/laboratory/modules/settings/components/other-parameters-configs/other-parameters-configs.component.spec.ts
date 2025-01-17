import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherParametersConfigsComponent } from './other-parameters-configs.component';

describe('OtherParametersConfigsComponent', () => {
  let component: OtherParametersConfigsComponent;
  let fixture: ComponentFixture<OtherParametersConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherParametersConfigsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherParametersConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
