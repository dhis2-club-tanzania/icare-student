import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosConfirmSalesModalComponent } from './pos-confirm-sales-modal.component';

describe('PosConfirmSalesModalComponent', () => {
  let component: PosConfirmSalesModalComponent;
  let fixture: ComponentFixture<PosConfirmSalesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosConfirmSalesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosConfirmSalesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
