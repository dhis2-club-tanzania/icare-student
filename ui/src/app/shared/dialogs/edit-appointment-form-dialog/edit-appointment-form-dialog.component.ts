import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../resources/openmrs';
import { formatDateToYYMMDD } from '../../helpers/format-date.helper';
import { DateField } from '../../modules/form/models/date-field.model';
import { Dropdown } from '../../modules/form/models/dropdown.model';
import { FormValue } from '../../modules/form/models/form-value.model';

@Component({
  selector: 'app-edit-appointment-form-dialog',
  templateUrl: './edit-appointment-form-dialog.component.html',
  styleUrls: ['./edit-appointment-form-dialog.component.scss']
})
export class EditAppointmentFormDialogComponent implements OnInit {

  saving: boolean = false;

  appointmentFormFields: any[]

  timeRange: { startTime: string; endTime: string }[] = [];
  appointmentFormGroup: FormGroup;

  datesFields: any;
  validTime: boolean = true;
  statusOptions: string[] 
  constructor(  private dialogRef: MatDialogRef<EditAppointmentFormDialogComponent>,
    private formBuilder: FormBuilder,
    private api: Api,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      patient: any,
      location: any,
      visit: any
      appointment: any
    }) { }

    appointmentForm: FormGroup = this.formBuilder.group({
      status: ['', Validators.required],
    })
  
  
  ngOnInit(): void {
    console.log(this.data)
    this.statusOptions = [
      "Scheduled",
      "Check In",
      "Completed",
      "Canceled",
    ]
  }

  async onUpdate(event) {
    event.stopPropagation();
    const status = this.appointmentForm.get('status').value.toLowerCase();
    const appointmentUuid = this.data.appointment.uuid;

    console.log(appointmentUuid)

    await this.api.appointmentscheduling.updateAppointment(appointmentUuid, {status})
  }
   onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
