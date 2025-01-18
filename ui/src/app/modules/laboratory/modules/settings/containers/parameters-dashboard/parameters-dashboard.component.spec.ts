import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersDashboardComponent } from './parameters-dashboard.component';

describe('ParametersDashboardComponent', () => {
  let component: ParametersDashboardComponent;
  let fixture: ComponentFixture<ParametersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametersDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
