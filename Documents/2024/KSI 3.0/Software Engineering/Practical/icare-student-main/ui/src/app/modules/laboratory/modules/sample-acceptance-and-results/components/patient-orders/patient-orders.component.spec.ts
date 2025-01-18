import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientOrdersComponent } from './patient-orders.component';

describe('PatientOrdersComponent', () => {
  let component: PatientOrdersComponent;
  let fixture: ComponentFixture<PatientOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
