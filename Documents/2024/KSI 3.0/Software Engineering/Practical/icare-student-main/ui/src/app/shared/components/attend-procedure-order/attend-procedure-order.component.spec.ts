import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendProcedureOrderComponent } from './attend-procedure-order.component';

describe('AttendProcedureOrderComponent', () => {
  let component: AttendProcedureOrderComponent;
  let fixture: ComponentFixture<AttendProcedureOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendProcedureOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendProcedureOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
