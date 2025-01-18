import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ReportParamsService } from "src/app/core/services/report-params.service";
import { flatten, groupBy } from "lodash";
import { SystemSettingsService } from "src/app/core/services/system-settings.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getAllUSerRoles } from "src/app/store/selectors/current-user.selectors";

@Component({
  selector: "app-reports-groups",
  templateUrl: "./reports-groups.component.html",
  styleUrls: ["./reports-groups.component.scss"],
})
export class ReportsGroupsComponent implements OnInit {
  reports$: Observable<any[]>;
  reportsAccessConfigurations$: Observable<any>;
  userRoles$: Observable<any>;
  reportsParametersConfigurations$: Observable<any>;
  standardReports$: Observable<any[]>;
  constructor(
    private reportParamsService: ReportParamsService,
    private systemSettingsService: SystemSettingsService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.reportsParametersConfigurations$ =
      this.systemSettingsService.getSystemSettingsDetailsByKey(
        "icare.Reports.Parameters.Configurations"
      );
    this.userRoles$ = this.store.select(getAllUSerRoles);
    this.reportsAccessConfigurations$ =
      this.systemSettingsService.getSystemSettingsByKey(
        "icare.Reports.Access.Configurations"
      );
    this.standardReports$ =
      this.systemSettingsService.getSystemSettingsMatchingAKey(
        `iCare.reports.standardReports`
      );
    this.reports$ = this.reportParamsService.getReportGroups().pipe(
      map((reportGroups) => {
        return flatten(
          reportGroups?.map((reportGroup) =>
            reportGroup?.reports?.map((report) => {
              return {
                ...report,
                name:
                  reportGroup?.name?.toLowerCase() !== "reports"
                    ? report?.name?.replace(
                        report?.name?.split(" ")[0] + " ",
                        ""
                      )
                    : report?.name,
                group:
                  reportGroup?.name?.toLowerCase() !== "reports"
                    ? report?.name?.split(" ")[0]
                    : "Reports",
                category: reportGroup,
              };
            })
          )
        );
      })
    );
  }

  onReloadList(shouldLoad: boolean) {
    if (shouldLoad) {
      this.loadData();
    }
  }
}
