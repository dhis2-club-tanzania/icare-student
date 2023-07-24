import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DateField } from "../../modules/form/models/date-field.model";
import { DateTimeField } from "../../modules/form/models/date-time-field.model";
import { TextArea } from "../../modules/form/models/text-area.model";
import { Dropdown } from '../../modules/form/models/dropdown.model';
import { PatientService } from "src/app/shared/resources/patient/services/patients.service";
import { formatDateToYYMMDD } from '../../helpers/format-date.helper';
import { FormGroup } from '@angular/forms';
import { FormValue } from '../../modules/form/models/form-value.model';
import { ClinicService } from 'src/app/modules/clinic/services/clinic.services';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {

  saving: boolean = false;
  
  appointmentFormFields: any[]

  appointmentFormGroup: FormGroup;

  constructor(
    private clinicService: ClinicService,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
) { }

  async ngOnInit() {
    
    this.appointmentFormFields = [
      new Dropdown({
        id: "patient",
        key: "patient",
        options: [],
        label: "Patient",
        required: true,
        searchControlType: "person",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      new Dropdown({
        id: "location",
        key: "location",
        options: [],
        label: "Location",
        required: true,
        locationUuid: "7f65d926-57d6-4402-ae10-a5b3bcbf7986",
        searchControlType: "location",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      new Dropdown({
        id: "service",
        key: "service",
        options: [],
        label: "Service",
        required: true,
        searchControlType: "location",
        multiple: false,
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      new Dropdown({
        id: "service_appointment_type",
        key: "service_appointment_type",
      options: [{
        key: "initial_appointment",
        value: "Initial Appointment",
        label: "Initial Appointment",
        name: "Initial Appointment",
        }, {
        key: "follow_up_appointment",
        value: "Follow-up Appointment",
        label: "Follow-up Appointment",
        name: "Follow-up Appointment",
        }],
        label: "Service Appointment Type",
        required: true,
        searchControlType: "service_appointment_type",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      new Dropdown({
        id: "provider",
        key: "provider",
        options: [],
        label: "Provider",
        required: true,
        searchControlType: "person",
        shouldHaveLiveSearchForDropDownFields: true,
      }),
      new DateField({
        id: "date",
        key: "date",
        label: "Date",
        min: formatDateToYYMMDD(new Date()),
        value: "",
      }),
      new DateTimeField({
        id: "startDate",
        key: "startat",
        label: "Start Date",
      }),
      new DateTimeField({
        id: "endDate",
        key: "endat",
        label: "End Date",
    }),
      new TextArea({
        id: "notes",
        key: "notes",
        label: "Notes",
        required: false,
      })
    ]


    
  }

  formUpdates($form: FormValue) {
    this.appointmentFormGroup = $form.form
  }


  onSave(event: Event): void{
    event.stopPropagation();
    this.clinicService.createAppointment(this.appointmentFormGroup.value)
    this.dialogRef.close();
  }


  onClose(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }
}
