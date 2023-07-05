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
  smsForm: FormGroup; // New SMS Form
  showSMSForm: boolean = false; // Show New SMS Form
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
    this.smsForm = this.formBuilder.group({
      scheduledSendDate: ['', Validators.required],
      message: ['', Validators.required],
      appointmentType: ['', Validators.required],

      
    });
    
  }

  onSave(event: Event) {

    

    console.log('onSave method called');

    event.stopPropagation();

    const { scheduledSendTime, phoneNumber, message, appointmentType  } = this.appointmentForm.controls;
    const restructuredDate = this.restructureDate(scheduledSendTime.value); // Restructure the scheduled date

    console.log(this.data.patient.patient.display);
    console.log('Date: The restructured date include ', restructuredDate); // Use the restructured date
    console.log('Phone Number:', phoneNumber.value);
    console.log('Notes:', message.value);
    console.log('Mother: ',this.data.patient.patient.display);

    this.schedules = new Schedules(restructuredDate, message.value, phoneNumber.value, this.data.patient.patient.display, appointmentType.value);
    console.log(this.schedules);
    this.addNewSMS() ;

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
  showAddSMSForm() {
    console.log("Clickef")
    this.showSMSForm = true;
    this.smsForm.reset();
  } 

  addNewSMS() {
    this.addSchedule();
    console.log('hello guys');
    
      const scheduledSendDate = this.smsForm.value?.scheduledSendDate;
      const appointmentType = this.smsForm.value?.appointmentType;
      const message = this.smsForm.value?.message;
      const phoneNumber = this.appointmentForm.value.phoneNumber;
      console.log(phoneNumber);
      const datereformed = this.restructureDate(scheduledSendDate)


      // Create a new SMS object using the data from the form
      const newSMS = new Schedules(
        datereformed,
        message,
        phoneNumber,
        this.data.patient.patient.display,
        appointmentType        
      );

      // Call the service to add the new SMS
      this.schedulesService.addSms(newSMS).subscribe({
        next: (data) => {
          console.log('New SMS added: ', data);
          // Perform any additional actions after adding the SMS if needed
        },
        error: (error) => {
          console.log('Error adding new SMS: ', error);
        }
      });

         // Reset the SMS form and hide it
         this.smsForm.reset();
         this.showSMSForm = false;
       
     }

  newSchedules(data: any) {
    this.schedules = data;
  }

  restructureDate(date: string) {
    const newDate = new Date(date);
    const fullYear = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
  
    // Pad the day component with a leading zero if it's less than 10
    const paddedDay = day < 10 ? `0${day}` : `${day}`;
  
    if (month < 10)  return `${fullYear}-0${month}-${paddedDay}`;
    return `${fullYear}-${month}-${paddedDay}`;
  }
  
  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
