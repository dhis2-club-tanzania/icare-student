import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { PatientService } from "src/app/shared/resources/patient/services/patients.service";

@Component({
  selector: "app-patient-address",
  templateUrl: "./patient-address.component.html",
  styleUrls: ["./patient-address.component.scss"],
})
export class PatientAddressComponent implements OnInit {
  @Input() personUuid: string;
  personDetails$: Observable<any>;
  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.personDetails$ = this.patientService.getPersonDetails(this.personUuid);
  }
}
