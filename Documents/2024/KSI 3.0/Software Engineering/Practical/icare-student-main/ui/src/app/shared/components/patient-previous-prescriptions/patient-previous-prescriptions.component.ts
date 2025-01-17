import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Patient } from "../../resources/patient/models/patient.model";
import { VisitObject } from "../../resources/visits/models/visit-object.model";
import { Visit } from "../../resources/visits/models/visit.model";
import { VisitsService } from "../../resources/visits/services";

@Component({
  selector: "app-patient-previous-prescriptions",
  templateUrl: "./patient-previous-prescriptions.component.html",
  styleUrls: ["./patient-previous-prescriptions.component.scss"],
})
export class PatientPreviousPrescriptionsComponent implements OnInit {
  @Input() patient: Patient;
  @Input() patientUuid: string;
  previousVisitDetails$: Observable<any>;
  constructor(private visitService: VisitsService) {}

  ngOnInit(): void {
    this.previousVisitDetails$ = this.visitService
      .getLastPatientVisit(this.patientUuid, true)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
