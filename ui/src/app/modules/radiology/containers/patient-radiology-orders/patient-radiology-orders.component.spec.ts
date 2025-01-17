import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRadiologyOrdersComponent } from './patient-radiology-orders.component';

describe('PatientRadiologyOrdersComponent', () => {
  let component: PatientRadiologyOrdersComponent;
  let fixture: ComponentFixture<PatientRadiologyOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientRadiologyOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRadiologyOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
