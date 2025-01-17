import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
import { getParentLocation } from "src/app/store/selectors";
import * as moment from "moment";

@Component({
  selector: "app-shared-render-report-dashboard",
  templateUrl: "./shared-render-report-dashboard.component.html",
  styleUrls: ["./shared-render-report-dashboard.component.scss"],
})
export class SharedRenderReportDashboardComponent implements OnInit {
  @Input() reportId: string;
  report$: Observable<any>;
  loadingReportData: boolean = false;
  startDate: Date;
  endDate: Date;
  dateChanged: boolean = false;
  facilityDetails$: Observable<any>;
  selectionDates: any;
  @Output() backToList: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private route: ActivatedRoute,
    private exportService: ExportService,
    private systemSettingsService: SystemSettingsService,
    private exportDataService: ExportDataService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.report$ = this.systemSettingsService.getSystemSettingsByUuid(
      this.reportId
    );
    this.facilityDetails$ = this.store.select(getParentLocation).pipe(
      map((response) => {
        return {
          ...response,
          logo:
            response?.attributes?.length > 0
              ? (response?.attributes?.filter(
                  (attribute) =>
                    attribute?.attributeType?.uuid ===
                    "09e78d52-d02f-44aa-b055-6bc01c41fa64"
                ) || [])[0]?.value
              : null,
        };
      })
    );
  }

  onGetBackToList(event: Event): void {
    event.stopPropagation();
    this.backToList.emit(true);
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

  onDownloadXLS(e: Event, id: string, fileName: string, type?: string) {
    e.stopPropagation();
    const table = document.getElementById("export-table");
    this.exportDataService.downloadTableToExcel(id, fileName, type);
  }

  onPrint(e) {
    e.stopPropagation();
    window.print();
  }
}
