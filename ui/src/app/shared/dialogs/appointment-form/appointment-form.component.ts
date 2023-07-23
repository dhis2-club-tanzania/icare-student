import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DateField } from "../../modules/form/models/date-field.model";
import { DateTimeField } from "../../modules/form/models/date-time-field.model";
import { TextArea } from "../../modules/form/models/text-area.model";
import { Dropdown } from "../../modules/form/models/dropdown.model";
import { PatientService } from "src/app/shared/resources/patient/services/patients.service";
import { formatDateToYYMMDD } from "../../helpers/format-date.helper";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormValue } from "../../modules/form/models/form-value.model";
import { ClinicService } from "src/app/modules/clinic/services/clinic.services";
import { AppointmentService } from "../../resources/appointment/services/appointment.service";
import { TimeRange } from "./time-range";
import { map } from "rxjs/operators";
import { from } from "rxjs";
import { Api } from "../../resources/openmrs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import axios, { AxiosResponse, AxiosError } from "axios";
@Component({
  selector: "app-appointment-form",
  templateUrl: "./appointment-form.component.html",
  styleUrls: ["./appointment-form.component.scss"],
})
export class AppointmentFormComponent implements OnInit {
  saving: boolean = false;

  appointmentFormFields: any[];
  scheduleStatus: any = null;

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
      patient: any;
      location: any;
      visit: any;
    }
  ) {}

  appointmentForm: FormGroup = this.formBuilder.group({
    patient: [this.data.patient.patient.uuid, Validators.required],
    location: [this.data.location.parentLocation.uuid, Validators.required],
    service: [this.data.location.uuid, Validators.required],
    appointmentType: ["", Validators.required],
    provider: ["", Validators.required],
    date: ["", Validators.required],
    startTime: ["", Validators.required],
    endTime: ["", Validators.required],
    notes: ["", Validators.required],
  });

  async ngOnInit() {
    this.timeRange = TimeRange;
    this.scheduleSmsStatus();

    console.log(this.data.visit);
    this.appointmentFormFields = [
      // new Dropdown({
      //   id: "appointment_type",
      //   key: "appointment_type",
      //   options: [],
      //   label: "Service Appointment Type",
      //   required: true,
      //   searchControlType: "appointmenttype",
      //   shouldHaveLiveSearchForDropDownFields: true,
      // }),
      // new Dropdown({
      //   id: "provider",
      //   key: "provider",
      //   options: [],
      //   label: "Provider",
      //   required: true,
      //   searchControlType: "provider",
      //   shouldHaveLiveSearchForDropDownFields: true,
      // }),
      new DateField({
        id: "date",
        key: "date",
        label: "Date",
        min: formatDateToYYMMDD(new Date()),
        value: "",
      }),
    ];
  }

  handleStartTimeChange($event) {
    const dateObj = $event.value;
    // this.appointmentForm.get("startTime").setValue(dateObj.startTime)
    this.appointmentForm.get("endTime").setValue(dateObj.endTime);
  }

  getMinDate() {
    return formatDateToYYMMDD(new Date());
  }

  formUpdates($form: FormValue) {
    this.appointmentFormGroup = $form.form;
  }

  getTimeFromDateString(dateString: string) {
    const date = new Date(dateString);

    const hours = `0${date.getUTCHours()}`.slice(-2);
    const minutes = `0${date.getUTCMinutes()}`.slice(-2);

    return `${hours}:${minutes}`;
  }

  postData(data: any): Observable<any> {
    const url = "http://localhost:3000/api/post"; // Replace with the actual URL of your server
    const headers = new HttpHeaders({
      "Content-Type": "application/json", // Set the appropriate content type
    });
    //@ts-ignore
    return this.http.post(url, data, { headers: headers });
  }

  async onSave() {
    //event.stopPropagation();

    const { patient, location, service, startTime, endTime, notes } =
      this.appointmentForm.value;

    const { date, provider, appointment_type } =
      this.appointmentFormGroup.value;

    const time = this.getStartEndDates(date, startTime, endTime);

    console.log(this.appointmentForm);

    const data = {
      fullName: "Habari ",
      phoneNumber: notes,
      clientId: patient,
      scheduledMessage: "APPOINTMENT",
      scheduledDate: date,
      appointment_type: appointment_type,
    };

    // Replace with your actual data
    axios
      .post("http://localhost:3000/api/post", data)
      .then((response: AxiosResponse) => {
        console.log(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
    this.dialogRef.close();

    return;
  }

  async scheduleSmsStatus() {
    const { patient, location, service, startTime, endTime, notes } =
      this.appointmentForm.value;

    // Replace with your actual data
    axios
      .get(`http://localhost:3000/api/getOne/${patient}`)
      .then((response: AxiosResponse) => {
        console.log("response.data");
        console.log(response.data);
        console.log("response.data");
        this.scheduleStatus = response.data;
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });

    return;
  }

  async cancelService() {
    const { patient, location, service, startTime, endTime, notes } =
      this.appointmentForm.value;

    console.log(this.appointmentForm);

    const data = {
      clientId: patient,
    };

    // Replace with your actual data
    axios
      .post(`http://localhost:3000/api/update/${patient}`, data)
      .then((response: AxiosResponse) => {
        console.log(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
    this.dialogRef.close();
    return;
  }

  async changeNoService() {
    const { patient, location, service, startTime, endTime, notes } =
      this.appointmentForm.value;

    console.log(this.appointmentForm);

    const data = {
      phoneNumber: notes,
    };

    // Replace with your actual data
    axios
      .post(`http://localhost:3000/api/changeNo/${patient}`, data)
      .then((response: AxiosResponse) => {
        console.log(response.data);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
    this.dialogRef.close();
    return;
  }

  getStartEndDates(date, startTime, endTime) {
    const currentDate = this.restructureDate(date);

    const start_time = this.getTimeFromDateString(startTime.startTime);
    const end_time = this.getTimeFromDateString(endTime);

    const _startDate = `${currentDate}T${start_time}:00`;
    const _endDate = `${currentDate}T${end_time}:00`;

    const startDate = new Date(_startDate).toISOString();
    const endDate = new Date(_endDate).toISOString();

    return { startDate, endDate };
  }

  restructureDate(date) {
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
