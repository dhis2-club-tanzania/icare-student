import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { go } from "src/app/store/actions";
import { AppState } from "src/app/store/reducers";

@Component({
  selector: "app-store-reports",
  templateUrl: "./store-reports.component.html",
  styleUrls: ["./store-reports.component.scss"],
})
export class StoreReportsComponent implements OnInit {
  standardReports$: Observable<any>;
  selectedReportCategory: string = "standard";
  constructor(
    private systemSettingsService: SystemSettingsService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.standardReports$ = this.systemSettingsService
      .getSystemSettingsMatchingAKey(`iCare.reports.standardReports.store`)
      .pipe(
        map((reports) => {
          return reports?.map((report) => {
            return {
              ...report,
              ...this.formatJsonExpectedValue(report),
            };
          });
        })
      );
  }

  formatJsonExpectedValue(report: any): any {
    try {
      return JSON.parse(report?.value);
    } catch {}
  }

  onViewReport(report: any): void {
    this.store.dispatch(go({ path: ["/pharmacy/reports/" + report?.uuid] }));
  }

  onSelectReportCategory(event: Event, category: string): void {
    event.stopPropagation();
    this.selectedReportCategory = category;
  }
}
