import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRadiologyOrdersListComponent } from './patient-radiology-orders-list.component';

describe('PatientRadiologyOrdersListComponent', () => {
  let component: PatientRadiologyOrdersListComponent;
  let fixture: ComponentFixture<PatientRadiologyOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientRadiologyOrdersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRadiologyOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
