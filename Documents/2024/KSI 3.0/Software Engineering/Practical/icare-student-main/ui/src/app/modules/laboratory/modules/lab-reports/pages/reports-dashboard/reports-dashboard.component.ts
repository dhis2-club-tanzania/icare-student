import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { AppState } from "src/app/store/reducers";
import { getLabConfigurations } from "src/app/store/selectors";

@Component({
  selector: "app-reports-dashboard",
  templateUrl: "./reports-dashboard.component.html",
  styleUrls: ["./reports-dashboard.component.scss"],
})
export class ReportsDashboardComponent implements OnInit {
  configuredReports$: Observable<any>;
  configs$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private systemSettingsService: SystemSettingsService
  ) {}

  ngOnInit(): void {
    this.configuredReports$ = this.systemSettingsService
      .getSystemSettingsMatchingAKey(`iCare.reports.standardReports`)
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
    // this.httpClient
    //   .get(
    //     BASE_URL + 'systemsetting?q=laboratory.sqlGet.laboratoryReports&v=full'
    //   )
    //   .pipe(
    //     map((response: any) => {
    //       return JSON.parse(response?.results[0]?.value || '[]');
    //     }),
    //     catchError((error) => {
    //       return of(error);
    //     })
    //   );

    this.configs$ = this.store.select(getLabConfigurations);
  }

  formatJsonExpectedValue(report: any): any {
    try {
      return JSON.parse(report?.value);
    } catch {}
  }
}
