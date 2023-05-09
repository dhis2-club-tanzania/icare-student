import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateField } from "../../modules/form/models/date-field.model";
import { DateTimeField } from "../../modules/form/models/date-time-field.model";
import { TextArea } from "../../modules/form/models/text-area.model";
import { Dropdown } from '../../modules/form/models/dropdown.model';
import { PatientService } from "src/app/shared/resources/patient/services/patients.service";
import { formatDateToYYMMDD } from '../../helpers/format-date.helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValue } from '../../modules/form/models/form-value.model';
import { ClinicService } from 'src/app/modules/clinic/services/clinic.services';
import { AppointmentService } from '../../resources/appointment/services/appointment.service';
import { TimeRange } from './time-range'
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { Api } from '../../resources/openmrs';
@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {

  saving: boolean = false;

  appointmentFormFields: any[]

  timeRange: { startTime: string; endTime: string }[] = [];
  appointmentFormGroup: FormGroup;

  datesFields: any;
  validTime: boolean = true;


  constructor(
    private appointmentService: AppointmentService,
    private clinicService: ClinicService,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    private formBuilder: FormBuilder,
    private api: Api,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      patient: any,
      location: any,
      visit: any
    }

  ) { }

  appointmentForm: FormGroup = this.formBuilder.group({
    patient: [this.data.patient.patient.uuid, Validators.required],
    location: [this.data.location.parentLocation.uuid, Validators.required],
    service: [this.data.location.uuid, Validators.required],
    appointmentType: ['', Validators.required],
    provider: ['', Validators.required],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    notes: ['', Validators.required],

  })

  async ngOnInit() {
    this.timeRange = TimeRange;

    console.log(this.data.visit)
    this.appointmentFormFields = [
      new Dropdown({
        id: "appointment_type",
        key: "appointment_type",
        options: [],
        label: "Service Appointment Type",
        required: true,
        searchControlType: "appointmenttype",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      new Dropdown({
        id: "provider",
        key: "provider",
        options: [],
        label: "Provider",
        required: true,
        searchControlType: "provider",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      new DateField({
        id: "date",
        key: "date",
        label: "Date",
        min: formatDateToYYMMDD(new Date()),
        value: "",
      })
    ]
  }

  handleStartTimeChange($event) {
    const dateObj = $event.value
    // this.appointmentForm.get("startTime").setValue(dateObj.startTime)
    this.appointmentForm.get("endTime").setValue(dateObj.endTime)
  }

  getMinDate() {
    return formatDateToYYMMDD(new Date())
  }

  formUpdates($form: FormValue) {
    this.appointmentFormGroup = $form.form
  }

  getTimeFromDateString(dateString: string) {
    const date = new Date(dateString);

    const hours = `0${date.getUTCHours()}`.slice(-2);
    const minutes = `0${date.getUTCMinutes()}`.slice(-2);

    return `${hours}:${minutes}`;
  }


  async onSave(event: Event) {
    event.stopPropagation();

    const { patient, location, service, startTime, endTime, notes } = this.appointmentForm.value;

    const { date, provider, appointment_type } = this.appointmentFormGroup.value;

    const time = this.getStartEndDates(date, startTime, endTime);

    const appointmentBlockPayload = {
      "location": {
        "uuid": service,

      },
      "provider": {
        "uuid": provider
      },
      "startDate": "2025-01-01T07:30:00.000",
      "endDate": "2025-01-01T07:30:00.000",
      types: [
        appointment_type
      ]
    }

    const appointmentBlock = await this.api.appointmentscheduling.createAppointmentBlock(appointmentBlockPayload)

    console.log(appointmentBlock);

    if (appointmentBlock.uuid) {
      
      const payload = {
        appointmentBlock: {
          uuid: appointmentBlock.uuid
        },
        startDate: time.startDate,
        endDate: time.endDate
  
      }
  
  
      const timeslot = await this.api.appointmentscheduling.createTimeSlot(payload)
  
  
      if (timeslot.uuid) {
  
        const appointmentPayload = {
          "timeSlot": {
            "uuid": timeslot.uuid
          },
          "visit": {
            "uuid": this.data.visit.uuid
          },
          "patient": {
            "uuid": patient
          },
          "appointmentType": {
            "uuid": appointment_type
          },
          "status": "SCHEDULED"
  
        }
        const appointment = await this.api.appointmentscheduling.createAppointment(appointmentPayload)
        console.log(appointment)
      }
    }

    this.dialogRef.close();
  }


  getStartEndDates(date, startTime, endTime) {
    const currentDate = this.restructureDate(date)

    const start_time = this.getTimeFromDateString(startTime.startTime);
    const end_time = this.getTimeFromDateString(endTime);

    const _startDate = `${currentDate}T${start_time}:00`;
    const _endDate = `${currentDate}T${end_time}:00`;

    const startDate = new Date(_startDate).toISOString()
    const endDate = new Date(_endDate).toISOString()

    return { startDate, endDate }
  }


  restructureDate(date) {
    const newDate = new Date(date)
    const fullYear = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate()
    if (month < 10) return `${fullYear}-0${month}-${day}`;
    return `${fullYear}-${month}-${day}`;
  }
  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
