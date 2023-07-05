import { Component, Inject, OnInit } from '@angular/core';
import { Schedules } from '../appointment-form/schedules.model';
//import { SchedulesService } from './schedules.service';
import { SchedulesService } from '../appointment-form/schedules.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit {
  schedules: Schedules;
  smsForm: FormGroup; // New SMS Form
  showSMSForm: boolean = false; // Show New SMS Form
  saving: boolean = false;
  appointmentForm: FormGroup;


  constructor(
    private schedulesService: SchedulesService,
    private dialogRef: MatDialogRef<EditFormComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: any,
      phoneNumber: string,
      patient: string,
      location: any,
      visit: any
    }
  ) { }

  ngOnInit() {
    this.appointmentForm = this.formBuilder.group({
      patient: [this.data.patient, Validators.required],
      appointmentType: ['', Validators.required],
      phoneNumber: [this.data.phoneNumber, Validators.required],
      scheduledSendTime: ['', Validators.required],
      message: ['', Validators.required],
    });
       
    
    
  }

  onSave(event: Event) {
    

    console.log('onSave method called');

    event.stopPropagation();

    const { scheduledSendTime,message,appointmentType} = this.appointmentForm.controls;
    const restructuredDate = this.restructureDate(scheduledSendTime.value);

    console.log(this.data.patient);
    console.log('Date:', scheduledSendTime.value);
    console.log('Phone Number:', this.data.phoneNumber);
    console.log('Notes:', message.value);
    console.log('Mother: ',this.data.patient);
    console.log('Appointment type: ',appointmentType.value);


    // Inside the onSave method
// ...

this.schedules = new Schedules(
  restructuredDate, // Apply the restructured date
  message.value,
  this.data.phoneNumber,
  this.data.patient,
  appointmentType.value,
  false, // Set a default value for the sentAt property
  this.data.id || undefined // Set a default value for id (e.g., undefined)
);
console.log(this.schedules);
this.editSMS();

// ...


    this.dialogRef.close();
  }

  editSchedule() {
    this.schedulesService.updateSchedules(this.schedules.id,this.schedules).subscribe({
      next: (data) => {
        console.log("Schedules edited: ", data);
        //this.newSchedules(data);
      },
      error: (error) => {
        console.log("Error editing schedules: ", error);
      }
    });
  }
  

  editSMS() {
    this.editSchedule();
    console.log('hello guys');
    
       
     }


     restructureDate(date: string) {
      return date;
    }
    

 

  

  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}

 

