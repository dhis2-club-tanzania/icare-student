import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDiagnosisModalComponent } from "../delete-diagnosis-modal/delete-diagnosis-modal.component";
import { VisitObject } from "../../resources/visits/models/visit-object.model";
import { Api } from '../../resources/openmrs'
import { EditAppointmentFormDialogComponent } from "../../dialogs";

@Component({
  selector: 'app-patient-appointment-summary',
  templateUrl: './patient-appointment-summary.component.html',
  styleUrls: ['./patient-appointment-summary.component.scss']
})
export class PatientAppointmentSummaryComponent implements OnInit {
  @Input() patientVisit: VisitObject;
  @Input() location: any;
  @Input() patient: any;
  appointments: any
  isLoadingAppointment: boolean

  constructor(private store: Store<AppState>, private dialog: MatDialog, private api: Api,) {}

   ngOnInit() {
    this.fetchPatientAppointment()
  }

  async fetchPatientAppointment() {
    this.isLoadingAppointment = true
    const patientUuid = this.patientVisit.patientUuid
    this.appointments = await this.api.appointmentscheduling.getAllAppointments({ patient: patientUuid, v: "full", limit: 10 })
    this.isLoadingAppointment = false
  }

  formatAppointmentDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-UK')
  }

  
  onEdit(e: Event, appointmentData) {
   let patient
    this.patient.subscribe(res => {patient = res})

    this.dialog
      .open(EditAppointmentFormDialogComponent, {
        width: "55%",
        data: {
          patient,
          visit: this.patientVisit,
          edit: true,
          appointment: appointmentData,
          location: this.location
        },
      }).afterClosed().subscribe(()=>this.fetchPatientAppointment())
      
  }

  onDelete(e: Event, diagnosisData) {
    // e.stopPropagation();
    this.dialog
      .open(DeleteDiagnosisModalComponent, {
        width: "25%",
        data: {
          patient: this.patientVisit?.patientUuid,
          diagnosis: diagnosisData?.diagnosisDetails
            ? diagnosisData?.diagnosisDetails
            : diagnosisData,
        },
      })
      
  }
}
