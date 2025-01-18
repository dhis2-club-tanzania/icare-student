import { Component, OnInit } from "@angular/core";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { formatDateToYYMMDD } from "../../helpers/format-date.helper";
import * as moment from "moment";
import { ExportDataService } from "src/app/core/services/export-data.service";
import { ExportService } from "../../services/export.service";
import { getLoadedSystemSettingsByKey } from "src/app/store/selectors";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { go } from "src/app/store/actions";

@Component({
  selector: "app-store-render-standard-report",
  templateUrl: "./store-render-standard-report.component.html",
  styleUrls: ["./store-render-standard-report.component.scss"],
})
export class StoreRenderStandardReportComponent implements OnInit {
  report$: Observable<any>;
  reportId: string;
  selectionDates: any;
  startDate: Date;
  endDate: Date;
  excelDownloadFormat$: Observable<any>;
  constructor(
    private route: ActivatedRoute,
    private systemSettingsService: SystemSettingsService,
    private exportDataService: ExportDataService,
    private exportService: ExportService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.reportId = this.route.snapshot.params["id"];
    this.report$ = this.systemSettingsService.getSystemSettingsByUuid(
      this.reportId
    );
    this.excelDownloadFormat$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "lis.systemSettings.others.downloadFileFormat.excel"
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
    this.selectionDates = null;

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

  onBackToReportsList(event: Event, path: string): void {
    event.stopPropagation();
    this.store.dispatch(go({ path: [path] }));
  }
}
