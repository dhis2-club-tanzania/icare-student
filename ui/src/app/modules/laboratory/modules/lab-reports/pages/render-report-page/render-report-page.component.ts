import { Component, OnInit } from "@angular/core";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ExportDataService } from "src/app/core/services/export-data.service";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { formatDateToYYMMDD } from "src/app/shared/helpers/format-date.helper";
import { ExportService } from "src/app/shared/services/export.service";
import { AppState } from "src/app/store/reducers";
import {
  getLoadedSystemSettingsByKey,
  getParentLocation,
} from "src/app/store/selectors";
import * as moment from "moment";

@Component({
  selector: "app-render-report-page",
  templateUrl: "./render-report-page.component.html",
  styleUrls: ["./render-report-page.component.scss"],
})
export class RenderReportPageComponent implements OnInit {
  reportId: string;
  report$: Observable<any>;
  loadingReportData: boolean = false;
  startDate: Date;
  endDate: Date;
  dateChanged: boolean = false;
  facilityDetails$: Observable<any>;
  selectionDates: any;
  excelDownloadFormat$: Observable<any>;
  constructor(
    private route: ActivatedRoute,
    private exportService: ExportService,
    private systemSettingsService: SystemSettingsService,
    private exportDataService: ExportDataService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.excelDownloadFormat$ = this.store.select(
      getLoadedSystemSettingsByKey(
        "lis.systemSettings.others.downloadFileFormat.excel"
      )
    );
    this.reportId = this.route.snapshot.params["id"];
    this.report$ = this.systemSettingsService.getSystemSettingsByUuid(
      this.reportId
    );
    this.facilityDetails$ = this.store.select(getParentLocation).pipe(
      map((response) => {
        // TODO: Softcode attribute type uuid
        return {
          ...response,
          logo:
            response?.attributes?.length > 0
              ? (response?.attributes?.filter(
                  (attribute) =>
                    attribute?.attributeType?.uuid ===
                    "e935ea8e-5959-458b-a10b-c06446849dc3"
                ) || [])[0]?.value
              : null,
        };
      })
    );
  }

  dateRangeSelect() {
    if (this.startDate && this.endDate) {
      this.onSelectPeriod(null, "custom-range");
    }
  }

  onSelectPeriod(buttonToggleChange: MatButtonToggleChange, mode?: string) {
    if (buttonToggleChange) {
      this.startDate = null;
      this.endDate = null;
    }
    this.dateChanged = false;

    setTimeout(() => {
      this.selectionDates = {
        startDate: moment(formatDateToYYMMDD(this.startDate))
          .startOf("day")
          .format()
          .split("T")
          .join(" ")
          .split("+")[0],
        endDate: moment(formatDateToYYMMDD(this.endDate))
          .endOf("day")
          .format()
          .split("T")
          .join(" ")
          .split("+")[0],
      };
      this.dateChanged = true;
      this.loadingReportData = true;
    }, 100);
  }

  onDownloadCSV(e: Event, currentReport: any): void {
    e.stopPropagation();
    const table = document.getElementById("export-table");
    this.exportService.exportCSV(currentReport?.description, table);
  }

  onDownloadXLS(
    e: Event,
    id: string,
    fileName: string,
    type?: string,
    extension?: string
  ) {
    e.stopPropagation();
    const table = document.getElementById("export-table");
    this.exportDataService.downloadTableToExcel(id, fileName, type, extension);
  }

  onPrint(e) {
    e.stopPropagation();
    window.print();
  }
}
