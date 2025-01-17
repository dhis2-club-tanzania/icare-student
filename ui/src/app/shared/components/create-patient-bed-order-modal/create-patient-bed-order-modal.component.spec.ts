import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePatientBedOrderModalComponent } from './create-patient-bed-order-modal.component';

describe('CreatePatientBedOrderModalComponent', () => {
  let component: CreatePatientBedOrderModalComponent;
  let fixture: ComponentFixture<CreatePatientBedOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePatientBedOrderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePatientBedOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
