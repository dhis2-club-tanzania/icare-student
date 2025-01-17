import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { VisitsService } from "src/app/shared/resources/visits/services";

@Component({
  selector: "app-lab-clinical-notes-summary",
  templateUrl: "./lab-clinical-notes-summary.component.html",
  styleUrls: ["./lab-clinical-notes-summary.component.scss"],
})
export class LabClinicalNotesSummaryComponent implements OnInit {
  @Input() patientUuid: string;
  @Input() labConfigs: any;
  @Input() visitUuid: string;
  visitData$: Observable<any>;
  constructor(private visitService: VisitsService) {}

  ngOnInit(): void {
    this.visitData$ = this.visitService.getLastPatientVisit(
      this.patientUuid,
      true
    );
  }
}
