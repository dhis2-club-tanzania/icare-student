import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersFilterComponent } from './parameters-filter.component';

describe('ParametersFilterComponent', () => {
  let component: ParametersFilterComponent;
  let fixture: ComponentFixture<ParametersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametersFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
