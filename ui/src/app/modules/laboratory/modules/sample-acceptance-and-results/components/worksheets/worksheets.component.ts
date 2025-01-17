import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { WorkSheetsService } from "src/app/modules/laboratory/resources/services/worksheets.service";

@Component({
  selector: "app-worksheets",
  templateUrl: "./worksheets.component.html",
  styleUrls: ["./worksheets.component.scss"],
})
export class WorksheetsComponent implements OnInit {
  @Input() datesParameters: any;
  worksheets$: Observable<any[]>;
  dataSetReportUuidForAcceptedSamplesWithNoResults$: Observable<string>;
  errors: any[] = [];
  worksheetDefinitionLabelFormatReference$: Observable<string>;
  constructor(
    private worksheetsService: WorkSheetsService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.errors = [];
    this.worksheets$ = this.worksheetsService.getWorkSheets();
    this.worksheetDefinitionLabelFormatReference$ = this.systemSettingsService
      .getSystemSettingsDetailsByKey(
        `iCare.laboratory.settings.worksheetdefinition.label.format`
      )
      .pipe(
        tap((response) => {
          if (response && !response?.error && response?.uuid) {
            return response;
          } else if (!response?.uuid && !response?.error) {
            this.errors = [
              ...this.errors,
              {
                error: {
                  error:
                    "iCare.laboratory.settings.worksheetdefinition.label.format is not set",
                  message:
                    "iCare.laboratory.settings.worksheetdefinition.label.format is not set",
                },
              },
            ];
          } else {
            this.errors = [...this.errors, response];
          }
        })
      );
    this.dataSetReportUuidForAcceptedSamplesWithNoResults$ =
      this.systemSettingsService
        .getSystemSettingsByKey(
          `iCare.laboratory.settings.sample.acceptedSamplesWithNoResults.dataSetReportUuid`
        )
        .pipe(
          tap((response) => {
            if (response && !response?.error && response !== "none") {
              return response;
            } else {
              this.errors = [
                ...this.errors,
                {
                  error: {
                    error:
                      "The key `iCare.laboratory.settings.sample.acceptedSamplesWithNoResults.dataSetReportUuid` is missing, contact IT",
                    message:
                      "The key `iCare.laboratory.settings.sample.acceptedSamplesWithNoResults.dataSetReportUuid` is missing, contact IT",
                  },
                },
              ];
            }
          })
        );
  }
}
