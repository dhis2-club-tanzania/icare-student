import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSavingOrderObservationModalComponent } from './confirm-saving-order-observation-modal.component';

describe('ConfirmSavingOrderObservationModalComponent', () => {
  let component: ConfirmSavingOrderObservationModalComponent;
  let fixture: ComponentFixture<ConfirmSavingOrderObservationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmSavingOrderObservationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSavingOrderObservationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
