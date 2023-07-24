import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointmentFormDialogComponent } from './edit-appointment-form-dialog.component';

describe('EditAppointmentFormDialogComponent', () => {
  let component: EditAppointmentFormDialogComponent;
  let fixture: ComponentFixture<EditAppointmentFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAppointmentFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppointmentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
