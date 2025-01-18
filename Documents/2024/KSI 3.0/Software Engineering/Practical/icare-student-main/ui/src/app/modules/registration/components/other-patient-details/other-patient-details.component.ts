import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { VisitsService } from "src/app/shared/resources/visits/services";

@Component({
  selector: "app-other-patient-details",
  templateUrl: "./other-patient-details.component.html",
  styleUrls: ["./other-patient-details.component.scss"],
})
export class OtherPatientDetailsComponent implements OnInit {
  @Input() patient: any;
  patientVisit$: Observable<any>;
  ID: string;
  constructor(private visitService: VisitsService) {}

  ngOnInit(): void {
    // TODO: Softcode ID reference
    this.ID = (this.patient?.person?.attributes?.filter(
      (attribute) => attribute?.attributeType?.display === "ID"
    ) || [])[0]?.value;
    this.patientVisit$ = this.visitService.getLastPatientVisit(
      this.patient?.uuid
    );
  }
}
