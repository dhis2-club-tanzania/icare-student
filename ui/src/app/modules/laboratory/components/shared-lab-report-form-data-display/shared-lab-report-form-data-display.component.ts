import { Component, Input, OnInit } from "@angular/core";
import { formatEncountersForLabReport } from "../../resources/helpers/format-encounter-information-for-lab-report.helper";

@Component({
  selector: "app-shared-lab-report-form-data-display",
  templateUrl: "./shared-lab-report-form-data-display.component.html",
  styleUrls: ["./shared-lab-report-form-data-display.component.scss"],
})
export class SharedLabReportFormDataDisplayComponent implements OnInit {
  @Input() encounterInformation: any[];
  formattedEncountersData: any[];
  constructor() {}

  ngOnInit(): void {
    this.formattedEncountersData = formatEncountersForLabReport(
      this.encounterInformation
    );
  }
}
