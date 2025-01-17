import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { WorkSheetsService } from "src/app/modules/laboratory/resources/services/worksheets.service";

@Component({
  selector: "app-result-entry-by-worksheet-home",
  templateUrl: "./result-entry-by-worksheet-home.component.html",
  styleUrls: ["./result-entry-by-worksheet-home.component.scss"],
})
export class ResultEntryByWorksheetHomeComponent implements OnInit {
  @Input() isLIS: boolean;
  @Input() datesParameters: any;
  @Input() viewType: string;
  worksheetDefinitions$: Observable<any[]>;
  multipleResultsAttributeType$: Observable<any>;
  currentWorksheetDefinitionUuid: string;
  conceptNameType: string;
  errors: any[] = [];
  constructor(
    private worksheetsService: WorkSheetsService,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.conceptNameType = this.isLIS ? "SHORT" : "FULLY_SPECIFIED";
    this.worksheetDefinitions$ = this.worksheetsService.getWorksheetDefinitions(
      this.datesParameters
    );

    this.multipleResultsAttributeType$ = this.systemSettingsService
      .getSystemSettingsByKey(
        `iCare.laboratory.settings.testParameters.attributes.multipleResultsAttributeTypeUuid`
      )
      .pipe(
        map((response) => {
          if (response && !response?.error) {
            return response;
          } else {
            this.errors = [...this.errors, response];
            return response;
          }
        })
      );
  }
}
