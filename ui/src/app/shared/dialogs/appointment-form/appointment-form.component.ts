import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchedulesService } from './schedules.service';
import { Schedules } from './schedules.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  schedules: Schedules;
  saving: boolean = false;

  constructor(
    private schedulesService: SchedulesService,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      phoneNumber: any,
      patient: any,
      location: any,
      visit: any
    }
  ) { }

  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      patient: [this.data.patient.patient.uuid, Validators.required],
      location: [this.data.location.parentLocation.uuid, Validators.required],
      appointmentType: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      scheduledSendTime: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSave(event: Event) {
    console.log('onSave method called');

    event.stopPropagation();

    const { scheduledSendTime, phoneNumber, message } = this.appointmentForm.controls;
    console.log(this.data.patient.patient.display);
    console.log('Date:', scheduledSendTime.value);
    console.log('Phone Number:', phoneNumber.value);
    console.log('Notes:', message.value);
    console.log('Mother: ',this.data.patient.patient.display);

    this.schedules = new Schedules(scheduledSendTime.value, message.value, phoneNumber.value, this.data.patient.patient.display );
    console.log(this.schedules);
    this.addSchedule();

    this.dialogRef.close();
  }

  addSchedule() {
    this.schedulesService.addSms(this.schedules).subscribe({
      next: (data) => {
        console.log("Schedules added: ", data);
        this.newSchedules(data);
      },
      error: (error) => {
        console.log("Error adding schedules: ", error);
      }
    });
  }

  newSchedules(data: any) {
    this.schedules = data;
  }

  restructureDate(date: string) {
    const newDate = new Date(date);
    const fullYear = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    if (month < 10) return `${fullYear}-0${month}-${day}`;
    return `${fullYear}-${month}-${day}`;
  }

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
