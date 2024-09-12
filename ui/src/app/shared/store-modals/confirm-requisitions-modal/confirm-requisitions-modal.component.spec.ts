import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRequisitionsModalComponent } from './confirm-requisitions-modal.component';

describe('ConfirmRequisitionsModalComponent', () => {
  let component: ConfirmRequisitionsModalComponent;
  let fixture: ComponentFixture<ConfirmRequisitionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRequisitionsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRequisitionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
